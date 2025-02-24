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

// Employee applies for leave
  exports.applyLeaveByEmp = async (req, res) => {
    try {
      const body = req.body;
      const token = req.headers.authorization;
      const empId = verifyTokenAndGetId(token);

      if (!empId) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Validate required fields
      if (!body.from_date || !body.to_date || !body.leave_type_id || !body.reason || !body.departmentId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Validate dates
      const fromDate = new Date(body.from_date);
      const toDate = new Date(body.to_date);
      const currentDate = new Date();

      if (fromDate > toDate) {
        return res.status(400).json({ message: 'From date cannot be after to date' });
      }

      // Calculate the number of leave days
      const leaveDays = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      // Validate leave type
      const leaveType = await leave_type.findByPk(body.leave_type_id);
      if (!leaveType) {
        return res.status(404).json({ message: 'Leave type not found' });
      }

      // Check the employee's remaining leave balance
      const assignedLeave = await assigned_leave.findOne({
        where: {
          employee_id: empId,
          leave_type_id: body.leave_type_id,
        },
      });

      if (!assignedLeave) {
        return res.status(404).json({ message: 'Leave balance not found for this employee and leave type' });
      }

      if (assignedLeave.max_leaves < leaveDays) {
        return res.status(400).json({ message: `Insufficient leave balance. You have only ${assignedLeave.max_leaves} days left for ${leaveType.leave_type_name}.` });
      }

      // Generate a unique request ID
      const uniqueRequestId = `${Date.now()}${crypto.randomInt(100000, 999999)}`;

      // Fetch HoD details
      const hodDetails = await sequelize2.query(
        `SELECT d.hod_id, e.email_id as hod_email
        FROM departments d
        JOIN employees e ON d.hod_id = e.id
        WHERE d.dep_id = :departmentId`,
        {
          replacements: { departmentId: body.departmentId },
          type: sequelize2.QueryTypes.SELECT,
        }
      );

      if (!hodDetails.length) {
        return res.status(404).json({ message: 'HoD details not found for this department' });
      }

      const { hod_id: hodId, hod_email: hodEmail } = hodDetails[0];

      // Insert leave request
      const leaveRequest = {
        employee_id: empId,
        from_date: fromDate.toISOString().split('T')[0],
        to_date: toDate.toISOString().split('T')[0],
        leave_type_id: body.leave_type_id,
        reason: body.reason,
        req_id: uniqueRequestId,
        status: 'Pending',
        hod_id: hodId,
        hod_email: hodEmail,
        request_date: currentDate.toISOString().split('T')[0],
        emp_email: body.emp_email,
      };

      const result = await leave_requests.create(leaveRequest);

      // Generate approval URL
      const approvalUrl = `${config.uiUrl}/leave-approval?req_id=${uniqueRequestId}`;

      // Send email to HoD
      const mailOptions = {
        from: `${config.fromName} <${config.fromMail}>`,
        to: hodEmail,
        subject: 'Leave Request Notification',
        html: `
          <p><b>Leave Request Details:</b></p>
          <p><b>Employee Email:</b> ${body.emp_email}</p>
          <p><b>Start Date:</b> ${fromDate.toISOString().split('T')[0]}</p>
          <p><b>End Date:</b> ${toDate.toISOString().split('T')[0]}</p>
          <p><b>Leave Type:</b> ${leaveType.leave_type_name}</p>
          <p><b>Reason:</b> ${body.reason}</p>
          <p>
            <b>URL to Approve/Reject:</b>
            <a href="${approvalUrl}">Click here to review the request</a>
          </p>
        `,
      };

      transportMail(mailOptions)
        .then((info) => {
          console.log('Email sent successfully:', info.response);
        })
        .catch((err) => {
          console.error('Error sending email:', err);
        });

      return res.json({
        success: true,
        message: 'Leave request submitted successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error inserting leave request:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to insert leave request',
        error: error.message,
      });
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
  
  // HOD approves/rejects leave
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
  
      // Update leave request status and HOD comments
      leave.status = status;
      leave.hod_comments = hod_comments;
      await leave.save();
  
      // If leave is approved, update the assigned_leave table and mark leave in login logs
      if (status === "Approved") {
        // Fetch the leave type and calculate the number of leave days
        const leaveType = await leave_type.findByPk(leave.leave_type_id);
        if (!leaveType) {
          return res.status(404).json({ success: false, message: "Leave type not found." });
        }
  
        const leaveDays = Math.floor(
          (new Date(leave.to_date) - new Date(leave.from_date)) / (1000 * 60 * 60 * 24)
        ) + 1; // Include both start and end dates
  
        // Fetch the assigned leave record for the employee and leave type
        const assignedLeave = await assigned_leave.findOne({
          where: {
            employee_id: leave.employee_id,
            leave_type_id: leave.leave_type_id,
          },
        });
  
        if (!assignedLeave) {
          return res.status(404).json({ success: false, message: "Assigned leave record not found." });
        }
  
        // Check if the employee has sufficient leave balance
        if (assignedLeave.max_leaves < leaveDays) {
          return res.status(400).json({ success: false, message: "Insufficient leave balance." });
        }
  
        // Update the remaining leave balance in the assigned_leave table
        assignedLeave.max_leaves -= leaveDays;
        await assignedLeave.save();
  
        // Mark leave in login logs
        const leaveDates = [];
        let currentDate = new Date(leave.from_date);
        const endDate = new Date(leave.to_date);
  
        // Generate leave dates
        while (currentDate <= endDate) {
          leaveDates.push(new Date(currentDate).toISOString().split("T")[0]); // Format to YYYY-MM-DD
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        // Bulk update login logs
        const logUpdates = leaveDates.map((date) =>
          LoginLogs.upsert({
            date,
            employeecode: leave.employee_id,
            on_leave: 1,
          })
        );
  
        await Promise.all(logUpdates);
      }
  
      // Send email notification to the employee
      const mailSubject = status === "Approved"
        ? "Leave Request Approved"
        : "Leave Request Rejected";
  
      const mailOptions = {
        from: `${config.fromName} <${config.fromMail}>`,
        to: leave.emp_email,
        subject: mailSubject,
        text: `Leave Request Details:\n
          Employee: ${leave.emp_email}\n
          From Date: ${leave.from_date}\n
          To Date: ${leave.to_date}\n
          Reason: ${leave.reason}\n
          HOD Comments: ${hod_comments}\n
          Status: ${status}`,
        html: `
          <p><b>Leave Request Details:</b></p>
          <p><b>Employee Email:</b> ${leave.emp_email}</p>
          <p><b>From Date:</b> ${leave.from_date}</p>
          <p><b>To Date:</b> ${leave.to_date}</p>
          <p><b>Reason:</b> ${leave.reason}</p>
          <p><b>HOD Comments:</b> ${hod_comments}</p>
          <p><b>Status:</b> ${status}</p>
        `,
      };
  
      transportMail(mailOptions)
        .then((info) => {
          console.log("Email sent successfully:", info.response);
        })
        .catch((err) => {
          console.error("Error sending email:", err);
        });
  
      console.log("mailOptions::", mailOptions);
  
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
    const { employee_id, from_date, to_date, leave_type_id, reason, emp_email } = req.body;
  
    const token = req.headers.authorization;
    const empId = verifyTokenAndGetId(token);
  
    console.log("Employee ID:", empId);
  
    if (!empId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  
    try {
      // Validate leave type
      const leaveType = await leave_type.findByPk(leave_type_id);
      if (!leaveType) {
        return res.status(404).json({ message: 'Leave type not found' });
      }
  
      // Check for duplicate leave request
      const duplicateRequest = await leave_requests.findOne({
        where: {
          employee_id,
          from_date,
          to_date,
        },
      });
  
      if (duplicateRequest) {
        return res.status(200).json({
          success: false,
          message: "Duplicate leave request found.",
        });
      }
  
      // Format dates
      const formattedFromDate = moment(from_date).format('YYYY-MM-DD');
      const formattedToDate = moment(to_date).format('YYYY-MM-DD');
  
      console.log("from_date:", from_date, "to_date:", to_date);
  
      const currentDate = new Date();
      const reqCurrentDate = currentDate.toLocaleDateString('en-CA');
  
      // Calculate the number of leave days
      const leaveDays = Math.floor((new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24)) + 1;
  
      // Fetch the assigned leave record for the employee and leave type
      const assignedLeave = await assigned_leave.findOne({
        where: {
          employee_id,
          leave_type_id,
        },
      });
  
      if (!assignedLeave) {
        return res.status(404).json({ message: 'Leave balance not found for this employee and leave type' });
      }
  
      // Check if the employee has sufficient leave balance
      if (assignedLeave.max_leaves < leaveDays) {
        return res.status(400).json({ message: `Insufficient leave balance. You have only ${assignedLeave.max_leaves} days left for ${leaveType.leave_type_name}.` });
      }
  
      // Create the leave request
      const leave = await leave_requests.create({
        employee_id: parseInt(employee_id, 10),
        from_date: formattedFromDate,
        to_date: formattedToDate,
        leave_type_id,
        reason,
        status: "Approved",
        added_by_admin: true,
        request_date: reqCurrentDate,
        emp_email: emp_email,
      });
  
      console.log("admin create leave::", leave);
  
      // Update the remaining leave balance in the assigned_leave table
      assignedLeave.max_leaves -= leaveDays;
      await assignedLeave.save();
  
      // Add leave to login logs
      const leaveDates = [];
      let date = new Date(from_date);
      const endDate = new Date(to_date);
  
      // Generate all leave dates
      while (date <= endDate) {
        leaveDates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
  
      // Bulk update login logs
      const logPromises = leaveDates.map((date) =>
        LoginLogs.upsert({
          date: date.toISOString().split("T")[0],
          employeecode: employee_id,
          on_leave: 1,
        })
      );
  
      console.log("logPromises::", logPromises);
  
      await Promise.all(logPromises);
  
      res.status(201).json({ success: true, message: "Leave created successfully.", leave });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        console.error("Validation Errors:", error.errors.map(e => e.message));
        return res.status(400).json({
          success: false,
          error: error.errors.map(e => e.message), // Specific validation errors
        });
      } else {
        console.error("Database Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  };
  
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
// Delete leave request if not approved
  exports.deleteRequestedLeave = async (req, res) => {
    const { id } = req.params;

    try {
      const leave = await leave_requests.findByPk(id);

      if (!leave) {
        return res.status(404).json({ success: false, message: "Leave request not found." });
      }

      // If the leave request was approved, restore the leave balance
      if (leave.status === "Approved") {
        // Calculate the number of leave days
        const leaveDays = Math.floor(
          (new Date(leave.to_date) - new Date(leave.from_date)) / (1000 * 60 * 60 * 24)
        ) + 1;

        // Fetch the assigned leave record for the employee and leave type
        const assignedLeave = await assigned_leave.findOne({
          where: {
            employee_id: leave.employee_id,
            leave_type_id: leave.leave_type_id,
          },
        });

        if (!assignedLeave) {
          return res.status(404).json({ message: 'Assigned leave record not found.' });
        }

        // Restore the leave balance
        assignedLeave.max_leaves += leaveDays;
        await assignedLeave.save();
      }

      // Delete the leave request
      await leave.destroy();

      res.status(200).json({
        success: true,
        message: "Leave request deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
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
