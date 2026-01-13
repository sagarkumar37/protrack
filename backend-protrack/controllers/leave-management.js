const { getCurrentDate, verifyTokenAndGetId, transportMail } = require('./helpers');
const LoginLogs = require('../models/LoginLogs');
const sequelize2 = require('../config/db');
const leave_requests = require("../models/leaveApplyRequest");
const leave_type = require("../models/leaveType");
const assigned_leave = require("../models/assignedLeave");

const config= require('../config/config.json');
const moment = require('moment');
const crypto = require('crypto');
const { where, Op, fn, col } = require('sequelize');

const Employees = require('../models/Employees');




function calculateLeaveDaysForEmp(startDate, endDate, fromDuration, toDuration) {
  const days = [];
  let totalLeaveDays = 0;
  let current = new Date(startDate);

  const isMultiDay = startDate.toDateString() !== endDate.toDateString();

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (!isWeekend) {
      let dayLeaveValue = 0;
      let onLeaveValue = 0;

      if (isMultiDay) {
        if (current.toDateString() === startDate.toDateString()) {
          dayLeaveValue = getDayValueForEmp(fromDuration);
          onLeaveValue = fromDuration === '1' ? 1 :
                         fromDuration === 'first_half' ? 2 :
                         fromDuration === 'second_half' ? 3 :
                         fromDuration === '0.25' ? 4 :
                         fromDuration === '0.75' ? 5 : 1;
        } else if (current.toDateString() === endDate.toDateString()) {
          dayLeaveValue = getDayValueForEmp(toDuration);
          onLeaveValue = toDuration === '1' ? 1 :
                         toDuration === 'first_half' ? 2 :
                         toDuration === 'second_half' ? 3 :
                         toDuration === '0.25' ? 4 :
                         toDuration === '0.75' ? 5 : 1;
        } else {
          dayLeaveValue = 1;
          onLeaveValue = 1;
        }
      } else {
        dayLeaveValue = getDayValueForEmp(fromDuration);
        onLeaveValue = fromDuration === '1' ? 1 :
                       fromDuration === 'first_half' ? 2 :
                       fromDuration === 'second_half' ? 3 :
                       fromDuration === '0.25' ? 4 :
                       fromDuration === '0.75' ? 5 : 1;
      }      

      days.push({
        date: current.toISOString().split('T')[0],
        on_leave_value: onLeaveValue,
        dayLeaveValue
      });

      totalLeaveDays += dayLeaveValue;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    days,
    totalLeaveDays
  };
}

function getDayValueForEmp(duration) {
  switch (duration) {
    case '1': return 1;
    case 'first_half': return 0.5;
    case 'second_half': return 0.5;
    case '0.25': return 0.25;
    case '0.75': return 0.75;
    default: return 0;
  }
}


// Employee applies for leave
  exports.applyLeaveByEmp = async (req, res) => {
    const body = req.body;
    const token = req.headers.authorization;
    const empId = verifyTokenAndGetId(token);

    if (!empId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const {
      employee_id,
      from_date,
      to_date,
      leave_type_id,
      reason,
      emp_email,
      from_date_leave_duration,
      to_date_leave_duration,
      departmentId,
      half_day_type
    } = body;

    try {
      // Validate required fields
      if (!employee_id || !from_date || !to_date || !leave_type_id || !from_date_leave_duration || !to_date_leave_duration || !departmentId) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }

      const fromDate = new Date(from_date);
      const toDate = new Date(to_date);

      // Date validation
      if (fromDate > toDate) {
        return res.status(400).json({ message: 'From date cannot be after to date' });
      }

      const timeDiff = toDate - fromDate;
      const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

      const leaveType = await leave_type.findByPk(leave_type_id);
      if (!leaveType) {
        return res.status(404).json({ message: 'Leave type not found' });
      }

      const leave_type_name = leaveType.leave_type_name;

      const existingLeave = await leave_requests.findOne({
        where: {
            employee_id,
            status: 'Approved',
            [Op.or]: [
                {
                    from_date: {
                        [Op.between]: [from_date, to_date]
                    }
                },
                {
                    to_date: {
                        [Op.between]: [from_date, to_date]
                    }
                },
                {
                    [Op.and]: [
                        { from_date: { [Op.lte]: from_date } },
                        { to_date: { [Op.gte]: to_date } }
                    ]
                }
            ]
        }
      });

      console.log("existing leave::", existingLeave)

      if (existingLeave) {
        return res.status(409).json({ message: 'Leave already approved for the selected date range.' });
      }

      const {
        totalLeaveDays,
        days: leaveDayDetails
      } = calculateLeaveDaysForEmp(fromDate, toDate, from_date_leave_duration, to_date_leave_duration);
      
      if (totalLeaveDays === 0) {
        return res.status(400).json({ message: 'Invalid leave durations provided' });
      }

      const leaveDays = totalLeaveDays;

      // Check leave balance
      const assignedLeave = await assigned_leave.findOne({
        where: { employee_id, leave_type_id },
      });

      if (!assignedLeave) {
        return res.status(404).json({ message: 'Leave balance not found.' });
      }

      if (assignedLeave.max_leaves < leaveDays) {
        return res.status(400).json({
          message: `Insufficient leave balance. You have only ${assignedLeave.max_leaves} days left.`,
        });
      }

      // Generate unique request ID
      const uniqueRequestId = `${Date.now()}${crypto.randomInt(100000, 999999)}`;

      // Fetch HoD details
      const hodDetails = await sequelize2.query(
        `SELECT d.hod_id, e.email_id as hod_email
        FROM departments d
        JOIN employees e ON d.hod_id = e.id
        WHERE d.dep_id = :departmentId`,
        { replacements: { departmentId }, type: sequelize2.QueryTypes.SELECT }
      );

      if (!hodDetails.length) {
        return res.status(404).json({ message: 'HoD details not found for this department' });
      }

      const { hod_id: hodId, hod_email: hodEmail } = hodDetails[0];

      // Create leave request
      const leaveRequest = await leave_requests.create({
        employee_id,
        from_date: moment(from_date).format('YYYY-MM-DD'),
        to_date: moment(to_date).format('YYYY-MM-DD'),
        leave_type_id,
        leave_type_name,
        reason,
        from_date_leave_duration,
        to_date_leave_duration,
        leave_days: leaveDays,
        half_day_type: half_day_type || null,
        status: 'Pending',
        req_id: uniqueRequestId,
        hod_id: hodId,
        hod_email: hodEmail,
        request_date: new Date().toISOString().split('T')[0],
        emp_email,
      });

      // Send email to HoD
      const approvalUrl = `${config.uiUrl}/leave-approval?req_id=${uniqueRequestId}`;
      const mailOptions = {
        from: `${config.fromName} <${config.fromMail}>`,
        to: hodEmail,
        subject: 'Leave Request Notification',
        html: `
          <p><b>Leave Request Details:</b></p>
          <p><b>Employee Email:</b> ${body.emp_email}</p>
          <p><b>Start Date:</b> ${moment(from_date).format('YYYY-MM-DD')}</p>
          <p><b>End Date:</b> ${moment(to_date).format('YYYY-MM-DD')}</p>
          <p><b>Leave Type:</b> ${leave_type_name}</p>
          <p><b>Reason:</b> ${body.reason}</p>
          <p><b>Total Leave Days:</b> ${leaveDays}</p>
          <p>
            <b>URL to Approve/Reject:</b>
            <a href="${approvalUrl}">Click here to review the request</a>
          </p>
        `,
      };

      transportMail(mailOptions)
        .then(info => console.log('Email sent:', info.response))
        .catch(err => console.error('Email error:', err));

      return res.status(201).json({
        success: true,
        message: 'Leave request submitted successfully.',
        data: leaveRequest,
      });
    } catch (error) {
      console.error('Error applying leave:', error);
      return res.status(500).json({ message: 'Failed to apply leave.' });
    }
  };
  
  exports.getLeaveRequests = async (req, res) => {
    try {
      const hodId = req.query.hodId;
      const token = req.headers.authorization;
  
      // Verify token
      const id = verifyTokenAndGetId(token);
      if (!id) {
        return res.status(401).send({ message: 'Invalid token' });
      }
  
      const leaveRequests = await leave_requests.findAll({
        where: {
          hod_id: hodId,
          status: 'Pending',
        },
        include: [
          {
            model: leave_type,
            as: "leaveType",
            attributes: ["leave_type_name", "description"],
          },
        ],
        order: [['request_date', 'DESC']],
      });
  
      res.status(200).json({
        resp_status: true,
        resp_code: 200,
        resp_msg: "Leave requests fetched successfully",
        resp_data: leaveRequests,
      });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch leave requests",
        error: error.message,
      });
    }
  };
  
  exports.hodApproveLeave = async (req, res) => {
    const { id } = req.params; // Leave request ID
    const { status, hod_comments } = req.body;
  
    try {
      const leave = await leave_requests.findByPk(id);
  
      if (!leave) {
        return res.status(404).json({ success: false, message: "Leave request not found." });
      }
  
      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status." });
      }
  
      // Update status and comments
      leave.status = status;
      leave.hod_comments = hod_comments;
      await leave.save();
  
      if (status === "Approved") {
        const leaveType = await leave_type.findByPk(leave.leave_type_id);
        if (!leaveType) {
          return res.status(404).json({ success: false, message: "Leave type not found." });
        }
  
        const assignedLeave = await assigned_leave.findOne({
          where: {
            employee_id: leave.employee_id,
            leave_type_id: leave.leave_type_id,
          },
        });
  
        if (!assignedLeave) {
          return res.status(404).json({ success: false, message: "Assigned leave record not found." });
        }
  
        const leaveDays = parseFloat(leave.leave_days);
        if (assignedLeave.max_leaves < leaveDays) {
          return res.status(400).json({ success: false, message: "Insufficient leave balance." });
        }
  
        // Deduct leave
        assignedLeave.max_leaves -= leaveDays;
        await assignedLeave.save();
  
        // Parse leave_day_details (JSON array stored in DB or passed elsewhere)
        const leaveDayDetails = JSON.parse(leave.leave_day_details || "[]");
  
        const logUpdates = leaveDayDetails.map((day) =>
          LoginLogs.upsert({
            date: day.date,
            employeecode: leave.employee_id,
            on_leave: day.on_leave_value
          })
        );
  
        await Promise.all(logUpdates);
      }
  
      // Send mail
      const mailSubject = status === "Approved" ? "Leave Request Approved" : "Leave Request Rejected";
  
      const mailOptions = {
        from: `${config.fromName} <${config.fromMail}>`,
        to: leave.emp_email,
        subject: mailSubject,
        html: `
          <p><b>Leave Request Details:</b></p>
          <p><b>Employee Email:</b> ${leave.emp_email}</p>
          <p><b>From Date:</b> ${leave.from_date}</p>
          <p><b>To Date:</b> ${leave.to_date}</p>
          <p><b>Reason:</b> ${leave.reason}</p>
          <p><b>HOD Comments:</b> ${hod_comments}</p>
          <p><b>Status:</b> ${status}</p>
          <p><b>Total Leave Days:</b> ${parseFloat(leave.leave_days)}</p>
        `,
      };
  
      transportMail(mailOptions)
        .then((info) => console.log("Email sent:", info.response))
        .catch((err) => console.error("Email error:", err));
  
      res.status(200).json({ success: true, message: `Leave ${status.toLowerCase()} successfully.` });
    } catch (error) {
      console.error("Error approving leave:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  
  
  exports.getLeaveById = async (req, res) => {
    try {
      const { req_id } = req.params;
  
      console.log("req_id::", req_id);
      
  
      const leave = await leave_requests.findOne({
        where: { req_id: req_id },
      });
  
      console.log("leaveleave:", leave);    
  
      if (!leave) {
        return res.status(404).json({ message: 'Leave not found' });
      }
  
      if (leave.status == 'Approved' || leave.status == 'Rejected') {
        return res.status(403).json({ message: 'leave.status', leaveStatus: leave.status });
      }
  
      res.status(200).json(leave);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch leave details' });
    }
  };
  
  
  // Admin creates leave for an employee
  exports.adminAddLeaveForEmp = async (req, res) => {
    const body = req.body;
    const token = req.headers.authorization;
    const empId = verifyTokenAndGetId(token);

    const transaction = await sequelize2.transaction();
    if (!empId) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const { 
        employee_id, 
        from_date, 
        to_date, 
        leave_type_id, 
        reason, 
        emp_email, 
        from_date_leave_duration, 
        to_date_leave_duration,
        half_day_type 
    } = body;

    try {
        // Validate required fields
        if (!employee_id || !from_date || !to_date || !leave_type_id || 
            !from_date_leave_duration || !to_date_leave_duration) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const leaveType = await leave_type.findByPk(leave_type_id);
        if (!leaveType) {
            return res.status(404).json({ message: 'Leave type not found' });
        }

        // Parse dates and validate
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);
        
        if (startDate > endDate) {
            return res.status(400).json({ message: 'End date cannot be before start date.' });
        }

        // Check for existing leave within the date range
        const existingLeave = await leave_requests.findOne({
          where: {
              employee_id,
              status: 'Approved',
              [Op.or]: [
                  {
                      from_date: {
                          [Op.between]: [from_date, to_date]
                      }
                  },
                  {
                      to_date: {
                          [Op.between]: [from_date, to_date]
                      }
                  },
                  {
                      [Op.and]: [
                          { from_date: { [Op.lte]: from_date } },
                          { to_date: { [Op.gte]: to_date } }
                      ]
                  }
              ]
          }
        });

        console.log("existing leave::", existingLeave)

        if (existingLeave) {
          return res.status(409).json({ message: 'Leave already approved for the selected date range.' });
        }

        // Calculate leave days
        const leaveDaysDetails = calculateLeaveDays(
            startDate, 
            endDate, 
            from_date_leave_duration, 
            to_date_leave_duration
        );
        
        if (leaveDaysDetails.totalLeaveDays === 0) {
            return res.status(400).json({ message: 'Invalid leave duration calculation.' });
        }

        // Check leave balance
        const assignedLeave = await assigned_leave.findOne({
            where: { employee_id, leave_type_id },
        });

        if (!assignedLeave) {
            return res.status(404).json({ message: 'Leave balance not found.' });
        }

        if (assignedLeave.max_leaves < leaveDaysDetails.totalLeaveDays) {
            return res.status(400).json({ 
                message: `Insufficient leave balance. You have only ${assignedLeave.max_leaves} days left.` 
            });
        }

        // Create leave request
        const currentDate = new Date();
        const leaveRequest = await leave_requests.create({
            employee_id,
            from_date: moment(startDate).format('YYYY-MM-DD'),
            to_date: moment(endDate).format('YYYY-MM-DD'),
            leave_type_id,
            leave_type_name: leaveType.leave_type_name,
            reason,
            from_date_leave_duration,
            to_date_leave_duration,
            leave_days: leaveDaysDetails.totalLeaveDays,
            half_day_type: null,
            status: 'Approved',
            added_by_admin: true,
            request_date: currentDate.toLocaleDateString('en-CA'),
            emp_email,
        }, { transaction });

        // Deduct leave balance
        assignedLeave.max_leaves -= leaveDaysDetails.totalLeaveDays;
        await assignedLeave.save({ transaction });

        // Update login logs
        const logPromises = leaveDaysDetails.days.map(day => 
            LoginLogs.upsert({
                date: day.date,
                employeecode: employee_id,
                on_leave: day.on_leave_value,
            }, { transaction })
        );

        await Promise.all(logPromises);
        await transaction.commit(); 

        return res.status(201).json({
            success: true,
            message: 'Leave created successfully.',
            data: leaveRequest,
        });
    } catch (error) {
        await transaction.rollback(); 
        console.error('Error creating leave:', error);
        return res.status(500).json({ message: 'Failed to create leave.' });
    }
  };

  // Helper function to calculate leave days and generate day details
  function calculateLeaveDays(startDate, endDate, fromDuration, toDuration) {
    const days = [];
    let totalLeaveDays = 0;
    let totalWorkingDays = 0;
    let current = new Date(startDate);

    // Determine if it's a multi-day leave
    const isMultiDay = startDate.toDateString() !== endDate.toDateString();

    while (current <= endDate) {
        const dayOfWeek = current.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0=Sunday, 6=Saturday
        
        if (!isWeekend) {
            totalWorkingDays++;
            
            let dayLeaveValue = 0;
            let onLeaveValue = 0;
            
            if (isMultiDay) {
                if (current.toDateString() === startDate.toDateString()) {
                    // Start day - use fromDuration
                    dayLeaveValue = getDayValue(fromDuration);
                    onLeaveValue = fromDuration === '1' ? 1 : 
                                  (fromDuration === 'first_half' ? 2 : 
                                  (fromDuration === 'second_half' ? 3 : 
                                  (fromDuration === '0.25' ? 4 : 5)));
                } 
                else if (current.toDateString() === endDate.toDateString()) {
                    // End day - use toDuration
                    dayLeaveValue = getDayValue(toDuration);
                    onLeaveValue = toDuration === '1' ? 1 : 
                                  (toDuration === 'first_half' ? 2 : 
                                  (toDuration === 'second_half' ? 3 : 
                                  (toDuration === '0.25' ? 4 : 5)));
                } 
                else {
                    // Middle day - full day
                    dayLeaveValue = 1;
                    onLeaveValue = 1;
                }
            } 
            else {
                // Single day leave - use fromDuration (should match toDuration)
                dayLeaveValue = getDayValue(fromDuration);
                onLeaveValue = fromDuration === '1' ? 1 : 
                              (fromDuration === 'first_half' ? 2 : 
                              (fromDuration === 'second_half' ? 3 : 
                              (fromDuration === '0.25' ? 4 : 5)));
            }
            
            days.push({
                date: current.toISOString().split('T')[0],
                on_leave_value: onLeaveValue,
                dayLeaveValue
            });
            
            totalLeaveDays += dayLeaveValue;
        }
        
        current.setDate(current.getDate() + 1);
    }
    
    return {
        days,
        totalLeaveDays,
        totalWorkingDays
    };
}

  // Helper function to get day value based on duration
  function getDayValue(duration) {
      switch (duration) {
          case '1': return 1;
          case 'first_half': return 0.5;
          case 'second_half': return 0.5;
          case '0.25': return 0.25;
          case '0.75': return 0.75;
          default: return 0;
      }
  }
  
// Fetch all leave requests (optional: with filters)
  exports.getRequestedLeave = async (req, res) => {
    const { employee_id, status } = req.query;

    const whereClause = {};
    if (employee_id) whereClause.employee_id = employee_id;
    if (status) whereClause.status = status;

    console.log("whereClause: 464", whereClause);

    try {
      const leaves = await leave_requests.findAll({
        where: whereClause,
        include: [
          {
            model: leave_type,
            as: "leaveType",
            attributes: ["leave_type_name", "description"],
          },
        ],
      });

      console.log("leaves::", leaves);

      res.status(200).json({ success: true, leaves });
    } catch (error) {
      console.log("error::", JSON.stringify(error.message));
      
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
// Delete leave request if not approved
exports.deleteRequestedLeave = async (req, res) => {
  const { id } = req.params;

  try {
    const leave = await leave_requests.findByPk(id);

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found." });
    }

    if (leave.status !== "Pending") {
      return res.status(403).json({
        success: false,
        message: "Only pending leave requests can be deleted."
      });
    }

    // Proceed to delete
    await leave.destroy();

    return res.status(200).json({
      success: true,
      message: "Pending leave request deleted successfully."
    });

  } catch (error) {
    console.error("Error deleting leave request:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


  
//To fetch leave types and remaining leave balance
exports.getLeaveTypesAndBalance = async (req, res) => {
  try {

      const { employee_id } = req.params;

      const leaveData = await sequelize2.query(
          `SELECT lt.leave_type_id, lt.leave_type_name, 
                  COALESCE(al.max_leaves, 0) AS remaining_balance
           FROM leave_type lt
           LEFT JOIN assigned_leave al 
           ON lt.leave_type_id = al.leave_type_id 
           AND al.employee_id = :employee_id`,
          {
              replacements: { employee_id },
              type: sequelize2.QueryTypes.SELECT,
          }
      );

      console.log("Query Result:", leaveData);

      if (!leaveData.length) {
          return res.status(404).json({ message: 'No leave data found for this employee' });
      }

      return res.json({
          success: true,
          data: leaveData,
      });
  } catch (error) {
      console.error('Error fetching leave types and balance:', error);
      return res.status(500).json({
          success: false,
          message: 'Failed to fetch leave types and balance',
          error: error.message,
      });
  }
};

exports.getLeaveTypes = async (req, res) => {
    try {
        const leaveTypes = await leave_type.findAll({
            attributes: ["leave_type_id", "leave_type_name"],
            order: [["leave_type_name", "ASC"]],
        });

        if (!leaveTypes.length) {
            return res.status(404).json({ success: false, message: "No leave types found" });
        }

        return res.json({
            success: true,
            data: leaveTypes,
        });
    } catch (error) {
        console.error("Error fetching leave types:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch leave types",
            error: error.message,
        });
    }
};

  exports.assignedMaxLeaveForEmp = async (req, res) => {
    try {
        console.log("req.body::", req.body);
        
        const { employee_id, leave_type_id, max_leaves } = req.body;

        if (!employee_id || !leave_type_id || !max_leaves) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const [existingRecord] = await sequelize2.query(
            "SELECT * FROM assigned_leave WHERE employee_id = ? AND leave_type_id = ?",
            {
                replacements: [employee_id, leave_type_id],
                type: sequelize2.QueryTypes.SELECT,
            }
        );

        console.log("existingRecord::", existingRecord)

        if (existingRecord) {
            await sequelize2.query(
                "UPDATE assigned_leave SET max_leaves = ? WHERE employee_id = ? AND leave_type_id = ?",
                {
                    replacements: [max_leaves, employee_id, leave_type_id],
                    type: sequelize2.QueryTypes.UPDATE,
                }
            );

            res.status(200).json({ message: "Leave updated successfully!" });
        } else {
            await sequelize2.query(
                "INSERT INTO assigned_leave (employee_id, leave_type_id, max_leaves) VALUES (?, ?, ?)",
                {
                    replacements: [employee_id, leave_type_id, max_leaves],
                    type: sequelize2.QueryTypes.INSERT,
                }
            );

            res.status(201).json({ message: "Leave assigned successfully!" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.accrueMonthlyLeavesForAllEmployees = async (req, res) => {
  try {
    const employees = await Employees.findAll();
    const currentMonth = moment().month(); // 0 = January, 11 = December

    for (const emp of employees) {
      const assignedLeaves = await assigned_leave.findAll({
        where: { employee_id: emp.id }
      });

      for (const leave of assignedLeaves) {
        let monthlyAccrual = 0;
        const leaveTypeId = leave.leave_type_id;

        switch (leaveTypeId) {
          case 2: // Casual Leave - 6/year, no carry forward
            if (currentMonth === 0) {
              leave.max_leaves = 0; // Reset in January
            }
            monthlyAccrual = 6 / 12;
            break;

          case 1: // Sick Leave - 10/year, carry forward
            monthlyAccrual = 10 / 12;
            break;

          case 3: // Paid Leave - 20/year, carry forward
            monthlyAccrual = 20 / 12;
            break;

          default:
            continue;
        }

        // Accrue monthly leaves
        leave.max_leaves = parseFloat((parseFloat(leave.max_leaves) + monthlyAccrual).toFixed(2));
        await leave.save();
      }

      console.log(`Leaves updated for employee: ${emp.id}`);
    }

    if (res) {
      res.status(200).json({ message: 'Leave accrual completed.' });
    }
  } catch (error) {
    console.error('Error in leave accrual:', error);
    if (res) {
      res.status(500).json({ error: 'Error in leave accrual.' });
    }
  }
};


