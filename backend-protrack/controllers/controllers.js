const sequelize2 = require('../config/db');
const Employees  = require('../models/Employees');
const attendance_regularization  = require('../models/InsertAttendanceRegularization');
const Activity   = require('../models/Activity');
const LoginLogs  = require('../models/LoginLogs');
const Projects   = require('../models/Projects');
const moment = require('moment')
const { getCurrentDate, verifyTokenAndGetId, transportMail } = require('./helpers');
const jwt = require('jsonwebtoken');
const config= require('../config/config.json');

const crypto = require('crypto');
const { request } = require('http');
const Departments = require('../models/departments');
const HolidayMst = require('../models/holiday');
const { where, Op, fn, col } = require('sequelize');
const DaysActivities = require('../models/DaysActivities');

// const Employee = require('../index');
// const { Employee } = require('../index');

cookie = require('cookie-parser');
// const  LoginLogs = require('../models/loginlogs');

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

// LOGIN LOGOUT APIS
// LOGS N THE USER


/*********************************************** Self Code **********************************************************/

exports.login = async (req, res) => {
    const {employee_code, password,loginTime } = req.body;
    if (!employee_code || !password) {
      return res.status(400).send({ message: 'Please provide both username and password' });
    }
    try {      
      const employees = await Employees.findOne({
        where: { username:employee_code },
        exclude: ['password']
      });
      console.log("login api", employees);
      if (!employees) {
        return res.status(400).send({ message: 'Invalid username' });  
      }
      if (employees.password !== password) {
        return res.status(400).send({ message: 'Invalid password' });
      }
      const token = jwt.sign({ id: employees.id }, JWT_SECRET, { expiresIn: '1d' });
      if(token){     
        const empcode = verifyTokenAndGetId(token) 
        let isHod= await Departments.findOne({
          where: { hod_id: employees.id},
          attributes: ['hod_id']
        })          
        
        res.status(200).send({ token, employees, isHod});
      }     

    } catch (error) {
      console.error(error)
      res.status(500).send({ message: 'Server error' });
      
    }
  };


exports.ValidateToken = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  // Verify the token using the secret key
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ valid: false, message: 'Token has expired' });
      } else {
        return res.status(401).json({ valid: false, message: 'Token is invalid' });
      }
    }

    res.status(200).json({ valid: true, message: 'Token is valid' });
  });
};



/*********************************************** Self Code **********************************************************/

  // LOGS OUT THE USER
exports.logout = async (req, res) => {



  };



// PUNCH IN PUNCH OUT APIS

// PUNCH IN THE USER

/****************Self Code *************************************************/

exports.punchIn = async (req, res) => {
  const { punchInTime } = req.body
  console.log("punchInTime:", punchInTime);
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).send({ message: 'Token missing' })
    }

    const empcode = verifyTokenAndGetId(token)
    console.log(empcode + ' empcode from punchin')

    const loginTime = new Date(punchInTime)
    
    const mysqlDateString = await getCurrentDate(0);

    const mysqlTime = loginTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const loginLog = await LoginLogs.findOne({
      where: {
        employeecode: empcode,
        date: mysqlDateString
      }
    });

    if (loginLog) {
      console.log("Record found:", loginLog);
      const updatedRecord = await LoginLogs.update(
        { start_time: mysqlTime },
        {
          where: {
            employeecode: empcode,
            date: mysqlDateString
          }
        }
      );
      console.log("Rows affected:", updatedRecord[0]);
    } else {
      console.log("No matching record found for the given empcode and date.");
    }


    console.log('Start time updated successfully.');
    res.status(200).send({ message: 'Record updated successfully' });

  } catch (error) {
    console.error('Error verifying token:', error)
    res.status(401).send({
      message: 'Invalid token'
    }) // send a response to the client indicating failure
  }
}

exports.punchOut  = async (req, res) => {
  const { punchOutTime } = req.body
  console.log("punchOutTime:", punchOutTime);
  

  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).send({ message: 'Token missing' })
    }

    const empcode = verifyTokenAndGetId(token)
    console.log(empcode + ' empcode from punchin')

    const loginTime = new Date(punchOutTime)
    const mysqlDateString = await getCurrentDate(0);

    const mysqlTime = loginTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const loginLog = await LoginLogs.findOne({
      where: {
        employeecode: empcode,
        date: mysqlDateString
      }
    });

    if (loginLog) {
      console.log("Record found:", loginLog);
      const updatedRecord = await LoginLogs.update(
        { end_time: mysqlTime },
        {
          where: {
            employeecode: empcode,
            date: mysqlDateString
          }
        }
      );
      console.log("Rows affected:", updatedRecord[0]);
    } else {
      console.log("No matching record found for the given empcode and date.");
    }

    console.log('Start time updated successfully.');
    res.status(200).send({ message: 'Record updated successfully' });

  } catch (error) {
    console.error('Error verifying token:', error)
    res.status(401).send({
      message: 'Invalid token'
    }) // send a response to the client indicating failure
  }
}

/****************Self Code **********************************************/

// TIMESHEET APIS


// GETS THE DROPDOWN FOR ACTIVITIES
exports.dropdownController = async (req, res) =>{
  
  try {
    const projects = await Projects.findAll({
      attributes: ['proj_name'],
      include: {
        model: Activity,
        as: 'activities',
        attributes: ['activity_id', 'activity_name']
      }
    })

    const data = {
      projects: projects
    }
    res.status(200).send(data)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error!')
  }
}

// SUBMITS THE TIMESHEET
exports.createDaysActivity = async (req, res) =>{
  try {
    const inputs = req.body.inputs;

    if (!inputs || !Array.isArray(inputs)) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    const token = req.headers.authorization;
    const empcode = await verifyTokenAndGetId(token);
    const date3 = await getCurrentDate(0);

    // const query = `
    //   INSERT INTO days_activities (activity, effort_placed, description, employee, day)
    //   VALUES ${inputs.map(input => `(
    //     (SELECT activity_id FROM activity WHERE activity_name = '${input.activity}'),
    //     ${input.time},
    //     '${input.description}',
    //     ${empcode},
    //     '${date3}'
    //   )`).join(', ')}
    // `;

    // await sequelize2.query(query, { 
    //   type: sequelize2.QueryTypes.INSERT });


    
    // Constructing the query with placeholders
    const query = `
      INSERT INTO days_activities (activity, effort_placed, description, employee, day)
      VALUES ${inputs.map((_, index) => `(
        (SELECT activity_id FROM activity WHERE activity_name = :activity${index}),
        :time${index},
        :description${index},
        :empcode,
        :date3
      )`).join(', ')}`;

    // Creating an object for named parameters
    const replacements = inputs.reduce((acc, input, index) => {
      acc[`activity${index}`] = input.activity;
      acc[`time${index}`] = input.time;
      acc[`description${index}`] = input.description;
      return acc;
    }, { empcode: empcode, date3: date3 });

    // Executing the query with parameterized inputs
    await sequelize2.query(query, { 
      replacements: replacements,
      type: sequelize2.QueryTypes.INSERT 
    });

    res.status(201).json({ message: 'Records created successfully' });
  } catch (err) {
    console.error("day activity error:",err);
    res.status(500).json({ message: 'An error occurred while creating records' });
  }
}

//insert new or update record based on date
exports.createDaysActivityV2 = async (req, res) => {
  try {
    const { inputs, date } = req.body;

    if (!inputs || !Array.isArray(inputs)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

    const token = req.headers.authorization;
    const empcode = await verifyTokenAndGetId(token);

    // Start a database transaction
    let transaction;
    try {
      transaction = await sequelize2.transaction();

      // Delete previous records for the employee and date
      await sequelize2.query(
        `DELETE FROM days_activities WHERE employee = ? AND day = ?`, 
        { replacements: [empcode, date], transaction }
      );

      const query = `
        INSERT INTO days_activities (activity, effort_placed, description, employee, day)
        VALUES (
          (SELECT activity_id FROM activity WHERE activity_name = ?),
          ?, ?, ?, ?
        )`;

      for (let input of inputs) {
        const params = [
          input.activity,          
          input.effort_placed,     
          input.description,       
          empcode,                 
          date             
        ];

        await sequelize2.query(query, { replacements: params, type: sequelize2.QueryTypes.INSERT, transaction });
      }

      // Commit the transaction if everything is successful
      await transaction.commit();

      res.status(201).json({ message: 'Records created successfully' });

    } catch (err) {
      console.error("Database error occurred:", err);
      if (transaction) await transaction.rollback(); // Rollback transaction if an error occurs

      // Handle specific error types
      if (err.original && err.original.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Duplicate entry error: Records already exist' });
      }

      return res.status(500).json({ message: 'An error occurred while creating records' });
    }

  } catch (err) {
    console.error("General error occurred:", err);
    return res.status(500).json({ message: 'An error occurred while processing the request' });
  }
};



exports.getTimeSheetAtDate = async (req,res) =>{
  
 const token = req.headers.authorization;

 if (!token) {
   res.send('No token found');
   return;
 }

 const id = await verifyTokenAndGetId(token);

const date= req.body.selectedDate;
 sequelize2.query(
  'SELECT * FROM days_activities WHERE employee = :empcode AND day = :date',
  {
    replacements: {
      empcode: id,
      date: date,
    },
    type: sequelize2.QueryTypes.SELECT,
  }
)
.then(results => {
  if (results.length > 0) {
    const activityIds = results.map(result => result.activity);

    sequelize2.query(
      `SELECT activity_id, activity_name FROM activity WHERE activity_id IN (:activityIds)`,
      {
        replacements: { activityIds: activityIds },
        type: sequelize2.QueryTypes.SELECT,
      }
    ).then(activityNames => {
      const activityMap = {};
      
      activityNames.forEach(activity => {
        activityMap[activity.activity_id] = activity.activity_name;
      });   

      const updatedResults = results.map(result => {
        return {
          ...result,
          activity: activityMap[result.activity] || result.activity,
        };
      });
      res.send(updatedResults);
    });
  } else {
    res.send(false);
  }
})
 .catch(error => {
   console.log(error);
   res.sendStatus(500);
 });
}


// GETS IF THE USER HAS SUBMITTED THE TIMESHEET
exports.timesheetFlag = async (req,res) =>{
   // 1. verify and get token id
  // 2. get todays date id from getsqldate.
  // 3. query the days_activity table using the decoded token id and date id from getsqldate.
  // 4. if any record is found, send true as response to the client
  // 5. if no record is found, send false as response to the client.

  const token = req.headers.authorization;

  if (!token) {
    res.send('No token found');
    return;
  }

  const id = await verifyTokenAndGetId(token);

  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"+id);

  // pending promise handled by using await
  const date = await getCurrentDate(0);

  // query the days_activity table for the employee and date id
  sequelize2.query(
    'SELECT * FROM days_activities WHERE employee = :empcode AND day = :date',
    {
      replacements: 
      {
        empcode: id,
        date: date,
      },
      type: sequelize2.QueryTypes.SELECT,
    },
  )
  .then(results => {
    if (results.length > 0) {
      // if record is found, send true
      res.send(true);
    } else {
      // if no record is found, send false
      res.send(false);
    }
  })
  .catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}



// TABLE APIS




function formatDate(date) {
  const year = date.getFullYear();
  // Months are zero-based in JavaScript, so add 1 and pad with zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // Pad the day with zero if necessary
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

exports.generateTimeEntries = async (req, res) => {
  const token = req.headers.authorization;
  const empcode = verifyTokenAndGetId(token);
  console.log(`${empcode} employeecode from /timeEntries`);

  if (!empcode) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const timeEntries = [];
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const numberOfDays = currentDate.getDate(); // e.g., 20 for December 20

  // Fetch all login logs for the employee from the first day of the month to today
  let loginLogs = [];
  try {
    loginLogs = await LoginLogs.findAll({
      where: {
        employeecode: empcode,
        date: {
          [Op.between]: [
            formatDate(firstDayOfMonth), // 'YYYY-MM-DD' of first day
            formatDate(currentDate),      // 'YYYY-MM-DD' of current day
          ],
        },
      },
      attributes: ['date', 'start_time', 'end_time'],
      order: [['date', 'DESC']], // Order logs by date descending
    });

    console.log('Retrieved Login Logs:', loginLogs);
  } catch (error) {
    console.error('Error fetching login logs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Create a map for quick lookup
  const loginLogMap = {};
  loginLogs.forEach((log) => {
    loginLogMap[log.date] = log;
  });

  console.log('Login Log Map:', loginLogMap);

  // Iterate from current date back to first day of the month
  for (let i = numberOfDays; i >= 1; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const mysqlDate = formatDate(date);
    console.log(`${mysqlDate} mysqlDate`);

    const timeEntry = {
      'S. No.': (numberOfDays - i + 1).toString(), // S. No. starts from 1 for the latest date
      'Date': mysqlDate,
      'Punch In': '---',
      'Punch Out': '---',
      'Project 1': '---',
      'Project 2': '---',
      'Project 3': '---',
    };

    const loginLog = loginLogMap[mysqlDate];
    if (loginLog) {
      if (loginLog.start_time) {
        timeEntry['Punch In'] = loginLog.start_time;
      }
      if (loginLog.end_time) {
        timeEntry['Punch Out'] = loginLog.end_time;
      }
    }

    timeEntries.push(timeEntry);
  }

  res.json(timeEntries);
};


// GETS THE EMPLOYEE REPORT
exports.employeeReport = async (req, res) => {
  try {
    const days = parseInt(req.params.days);
    const token = req.headers.authorization;
    const empCode = verifyTokenAndGetId(token);
    const reportArray = [];

    const reportQuery = 
    `
      SELECT 
        loginlogs.date,
        loginlogs.start_time,
        loginlogs.end_time,
        SEC_TO_TIME(TIMESTAMPDIFF(SECOND, loginlogs.start_time, loginlogs.end_time)) AS total_time,
        SUM(CASE WHEN activity.useful = 1 THEN days_activities.effort_placed ELSE 0 END) AS productive_time,
        SUM(CASE WHEN activity.useful = 0 THEN days_activities.effort_placed ELSE 0 END) AS non_productive_time,
        SUM(CASE WHEN activity.activity_id = (SELECT activity_id FROM activity WHERE activity_name = 'Idle') THEN days_activities.effort_placed ELSE 0 END) AS idle_time,
        ROUND((SUM(CASE WHEN activity.useful = 1 THEN days_activities.effort_placed ELSE 0 END) / (9 * 60) * 100), 2) AS productive_percentage,
        loginlogs.holiday AS is_holiday,
        loginlogs.on_leave AS is_on_leave
      FROM 
        loginlogs
      LEFT JOIN 
        days_activities ON loginlogs.date = days_activities.day
      LEFT JOIN 
        activity ON days_activities.activity = activity.activity_id
      WHERE 
        loginlogs.employeecode = ${empCode} AND loginlogs.date BETWEEN DATE_SUB(NOW(), INTERVAL ${days} DAY) AND NOW()
      GROUP BY 
        loginlogs.date;
    `;  

    // execute the query and get the report data
    const reportData = await sequelize2.query(reportQuery, { type: sequelize2.QueryTypes.SELECT });

    // loop through the report data and create report objects for each day
    for (const reportRow of reportData) {
      const reportObj = {
        date: reportRow.date,
        startTime: reportRow.start_time,
        endTime: reportRow.end_time,
        productiveTime: reportRow.productive_time,
        nonProductiveTime: reportRow.non_productive_time,
        productivePercentage: reportRow.productive_percentage,
        idleTime: reportRow.idle_time,
        totalTime: reportRow.total_time,
        onLeave: reportRow.is_on_leave,
        holiday: reportRow.is_holiday,
      };

      // add the report object to the report array
      reportArray.push(reportObj);
    }

    // send the report array as the response
    res.json(reportArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// EMPLOYEE DETAILS API



 exports.fetchEmployeeName = async (req, res) => {
  try {
    // 1. Verify and get token
    const token = req.headers.authorization;
    const id = verifyTokenAndGetId(token);

    // 2. If successfully id is assigned get employee first_name, middle_name, and last_name (whatever is available)
    const employee = await Employees.findOne({
      where: { id: id },
      attributes: ['first_name', 'middle_name', 'last_name']
    });

    if (!employee) {
      return res.status(404).send({ message: 'Employee not found' });
    }

    // 3. Return/send all the fields that were fetched to the client
    return res.send(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};


exports.fetchEmployeeCode= async (req, res) => {
  const token = req.headers.authorization;
  const id = verifyTokenAndGetId(token);

  if (id === null) {
    res.status(401).send({ message: 'Invalid token format' });
  } else {
    res.send({ id });
  }
};



// FETCH TIME APIS

// self
exports.fetchPunchInOut = async (req, res) => {
  //1. verify and get token id.
  //2. query loginlogs for punchin and punchout for that employee for current date.
  //4. send the data received  to the client.

  const token = req.headers.authorization

  if(!token)
    res.send('No token found')

  const empcode = verifyTokenAndGetId(token)
  const data = {
    'punchIn': null,
    'punchOut': null
  }

  const date = await getCurrentDate(0);
  try {
    const loginLog = await LoginLogs.findOne({
      where: { employeecode: empcode, date: date},
      attributes: ['start_time', 'end_time']
    })
    if (loginLog) {
      if (loginLog.start_time) {
        data.punchIn = loginLog.start_time

        // console.log(login.start_time + "login.start_time from timeEntry");
      }
      if (loginLog.end_time) {
        data.punchOut = loginLog.end_time
        // timeEntry["Punch Out"] = loginLog.end_time;
      }
      const jsonData = JSON.stringify(data)
      console.log('json data loginlogs ' + jsonData)
    }
  } catch (error) {
    console.error(error)
  }

  // Get start_day and end_day for requested employee
  const employeeAttendance = await LoginLogs.findOne({
    where: { date: date, employeecode: empcode }
  })
  if (!employeeAttendance) {
    res.json({ start_day: null, end_day: null })
    return;
  }
  res.json({
    start_day: employeeAttendance.start_time,
    end_day: employeeAttendance.end_time
  })
}


// self
// FETCH HOURS SINCE PUNCHED IN API
exports.apiHours = async (req, res) => {
  const token = req.headers.authorization
  const employeeCode = await verifyTokenAndGetId(token)
  const date2 = await getCurrentDate(0);

  console.log(employeeCode + ' empcode from verifyTokenAndGetId and hours')
  console.log(date2 + ' date from getsqlDate and hours')
  try {
    // find the loginlog for the employee on the given date
    const loginLog = await LoginLogs.findOne({
      where: {
        employeecode: employeeCode,
        date: date2
      },
     
    })

    if (!loginLog) {
      // if no loginlog is found, return 404 Not Found
      res.status(404).json({ message: 'No login log found for the given employee and date' })
      return;
    }

    // calculate the hours worked as the difference between end_time and start_time
    const start = new Date(`01/01/2007 ${loginLog.start_time}`)
    const end = new Date(`01/01/2007 ${loginLog.end_time}`)
    const hours = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(4)

    // return the hours worked as JSON response
    res.json({ hours })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// self
exports.apiMinutes =   async (req, res) => {
  const token = req.headers.authorization
  const employeeCode = await verifyTokenAndGetId(token)
  const date = await getCurrentDate(0)

  console.log(employeeCode + ' empcode from verifyTokenAndGetId and minutes')
  console.log(date + ' date from getsqlDate and minutes')
  try {
    // find the loginlog for the employee on the given date
    const loginLog = await LoginLogs.findOne({
      where: {
        employeecode: employeeCode,
        date: date
      }
    })

    if (!loginLog) {
      // if no loginlog is found, return 404 Not Found
      res.status(404).json({ message: 'No login log found for the given employee and date' })
      return;
    }

    // calculate the minutes worked as the difference between end_time and start_time
    const start = new Date(`01/01/2007 ${loginLog.start_time}`)
    const end = new Date(`01/01/2007 ${loginLog.end_time}`)
    const minutes = ((end.getTime() - start.getTime()) / (1000 * 60)).toFixed(4)

    // return the minutes worked as JSON response
    res.json({ minutes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}






  //************* DASHBOARD APIS******************************** */

  exports.getTotalTime = async (req, res) => {
    try {
      const { days } = req.params;
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Authorization token is missing.' });
      }
  
      const employeeCode = verifyTokenAndGetId(token);
  
      let currentDate;
      let startDate;
  
      // Parse 'days' as an integer to ensure correct comparison
      const parsedDays = parseInt(days, 10);
  
      switch (parsedDays) {
        case 0:
          // Today only
          currentDate = await getCurrentDate(0);
          startDate = await getCurrentDate(0);
          break;
        case 1:
          // Yesterday and today
          currentDate = await getCurrentDate(0);
          startDate = await getCurrentDate(1);
          break;
        case 7:
          // Last 7 days including today
          currentDate = await getCurrentDate(0);
          startDate = await getCurrentDate(6);
          break;
        case 30:
          // Last 30 days including today
          currentDate = await getCurrentDate(0);
          startDate = await getCurrentDate(29);
          break;
        default:
          return res.status(400).json({ error: 'Invalid days parameter. Accepted values are 0, 1, 7, 30.' });
      }
  
      const query = `
        SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)))) AS total_time
        FROM loginlogs
        WHERE employeecode = :employeecode
          AND \`date\` BETWEEN :startDate AND :endDate
      `;
  
      const replacements = {
        employeecode: employeeCode,
        startDate,
        endDate: currentDate,
      };
  
      const result = await sequelize2.query(query, {
        replacements,
        type: sequelize2.QueryTypes.SELECT,
      });
  
      // Initialize total_time with a default value
      let total_time = '00:00:00';
  
      if (result && result.length > 0 && result[0].total_time) {
        total_time = result[0].total_time;
      }
  
      res.json({ total_time });
    } catch (err) {
      console.error('Error fetching total time:', err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  };

  exports.getTotalEffortTime = async (req, res) => {
    try {
        const { days } = req.params;
        console.log('days::', days);
        
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Authorization token is missing.' });
        }

        const employeeCode = verifyTokenAndGetId(token);
        const parsedDays = parseInt(days, 10);

        if (![0, 1, 7, 30].includes(parsedDays)) {
            return res.status(400).json({ error: 'Invalid days parameter. Accepted values are 0, 1, 7, 30.' });
        }

        const currentDate = await getCurrentDate(0);
        const startDate = await getCurrentDate(parsedDays === 0 ? 0 : parsedDays - 1);

        console.log('currentDate::', currentDate, "startDate:", startDate);
        

        const data = await getAggregatedData(startDate, currentDate, employeeCode);
        res.json(data);
    } catch (error) {
        console.error("Error in getTotalEffortTime:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  async function getAggregatedData(startDate, endDate, employeeCode) {
      try {
          const records = await DaysActivities.findAll({
              attributes: [
                  [sequelize2.fn('DATE', sequelize2.col('day')), 'recordDate'],
                  [sequelize2.fn('GROUP_CONCAT', sequelize2.col('effort_placed')), 'concatenatedData'],
                  [sequelize2.fn('SUM', sequelize2.col('effort_placed')), 'totalEffort']
              ],
              where: {
                  day: { [Op.between]: [startDate, endDate] },
                  employee: employeeCode
              },
              group: [sequelize2.fn('DATE', sequelize2.col('day'))],
              raw: true
          });

          return records.length > 0 ? records : [{ totalEffort: 0 }];
      } catch (error) {
          console.error("Error fetching aggregated data:", error);
          throw error;
      }
  }
 


exports.getUnproductiveTime = async (req, res) => { 
const { days } = req.params;
const token = req.headers.authorization;
const employeeCode = verifyTokenAndGetId(token);

let currentDate = null;
let startDate = null;

if(days == 0){
 currentDate = await getCurrentDate(0);
 startDate = await getCurrentDate(0);
}

if(days == 1){
  currentDate = await getCurrentDate(1);
  startDate = await getCurrentDate(1);
 }

 if(days == 7){
  currentDate = await getCurrentDate(0);
  startDate = await getCurrentDate(6);
 }

 if(days == 30){
  currentDate = await getCurrentDate(0);
  startDate = await getCurrentDate(29);
 }

try {
  const result = await sequelize2.query(
    `SELECT 
    TIME_FORMAT(SEC_TO_TIME(SUM(da.effort_placed*60)), '%H:%i:%s') AS unproductive_time
FROM 
    loginlogs ll
LEFT JOIN 
    days_activities da ON da.day = ll.date AND da.employee = ll.employeecode
INNER JOIN 
    activity a ON da.activity = a.activity_id
WHERE 
    a.useful = 0 AND ll.employeecode = :employeecode AND ll.date BETWEEN :startDate AND :endDate;
 
      `,
    {
      replacements: {
        employeecode: employeeCode,
        startDate: startDate,
        endDate: currentDate,
      },
      type: sequelize2.QueryTypes.SELECT,
    }
  );
  if (result[0].unproductive_time)
    var total_time = result[0].unproductive_time;

  else 
  total_time = '00:00:00'
  res.json({ total_time });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
}
};

exports.getProductiveTime = async (req, res) => { 
  const { days } = req.params;
  const token = req.headers.authorization;
  const employeeCode = verifyTokenAndGetId(token);
  
  let currentDate = null;
  let startDate = null;
  
  if(days == 0){
   currentDate = await getCurrentDate(0);
   startDate = await getCurrentDate(0);
  }

  if(days == 1){
    currentDate = await getCurrentDate(1);
    startDate = await getCurrentDate(1);
   }

   if(days == 7){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(6);
   }

   if(days == 30){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(29);
   }
  
  try {
    const result = await sequelize2.query(
      `SELECT 
    TIME_FORMAT(SEC_TO_TIME(SUM(da.effort_placed*60)), '%H:%i:%s') AS productive_time
FROM 
    loginlogs ll
LEFT JOIN 
    days_activities da ON da.day = ll.date AND da.employee = ll.employeecode
INNER JOIN 
    activity a ON da.activity = a.activity_id
WHERE 
    a.useful = 1 AND ll.employeecode = :employeecode AND ll.date BETWEEN :startDate AND :endDate;
 
      `,
      {
        replacements: {
          employeecode: employeeCode,
          startDate: startDate,
          endDate: currentDate,
        },
        type: sequelize2.QueryTypes.SELECT,
      }
    );
    if (result[0].productive_time)
    var total_time = result[0].productive_time;

    else 
    total_time = '00:00:00'
    res.json({ total_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
  };


exports.getLearningTime = async (req, res) => { 
  const { days } = req.params;
  const token = req.headers.authorization;
  const employeeCode = verifyTokenAndGetId(token);
  
  let currentDate = null;
  let startDate = null;
  
  if(days == 0){
   currentDate = await getCurrentDate(0);
   startDate = await getCurrentDate(0);
  }

  if(days == 1){
    currentDate = await getCurrentDate(1);
    startDate = await getCurrentDate(1);
   }

   if(days == 7){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(6);
   }

   if(days == 30){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(29);
   }
  
  try {
    const result = await sequelize2.query(
      `SELECT TIME_FORMAT(SEC_TO_TIME(SUM(effort_placed * 60)), '%H:%i:%s') AS learning_time
      FROM days_activities
      JOIN activity ON days_activities.activity = activity.activity_id
      WHERE days_activities.employee = :employeecode
        AND activity.activity_type = 'Learning' 
        AND days_activities.day >= :startDate 
        AND days_activities.day <= :endDate;
      `,
      {
        replacements: {
          employeecode: employeeCode,
          startDate: startDate,
          endDate: currentDate,
        },
        type: sequelize2.QueryTypes.SELECT,
      }
    );
    if (result[0].learning_time){
    var total_time = result[0].learning_time;
    console.log(total_time  + 'learning time')

  }




    else 
    total_time = '00:00:00'

    console.log(`${total_time} learning time`)
    res.json({ total_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
  };

exports.getBreakTime = async (req, res) =>{ 
  const { days } = req.params;
  const token = req.headers.authorization;
  const employeeCode = verifyTokenAndGetId(token);
  
  let currentDate = null;
  let startDate = null;
  
  if(days == 0){
   currentDate = await getCurrentDate(0);
   startDate = await getCurrentDate(0);
  }

  if(days == 1){
    currentDate = await getCurrentDate(1);
    startDate = await getCurrentDate(1);
   }

   if(days == 7){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(6);
   }

   if(days == 30){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(29);
   }
  
  try {
    const result = await sequelize2.query(
      `SELECT TIME_FORMAT(SEC_TO_TIME(SUM((da.effort_placed * 60))), '%H:%i:%s') AS break_time
      FROM days_activities da
      JOIN activity a ON da.activity = a.activity_id
      WHERE a.activity_type = 'Break'
      AND da.employee = :employeecode
      AND da.day BETWEEN :startDate AND :endDate;
      `,
      {
        replacements: {
          employeecode: employeeCode,
          startDate: startDate,
          endDate: currentDate,
        },
        type: sequelize2.QueryTypes.SELECT,
      }
    );
    if (result[0].break_time)
    var total_time = result[0].break_time;

    else 
    total_time = '00:00:00'
    res.json({ total_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
  };


exports.getIdleTime = async(req,res) => {
  const { days } = req.params;
  const token = req.headers.authorization;
  const employeeCode = verifyTokenAndGetId(token);
  
  let currentDate = null;
  let startDate = null;
  
  if(days == 0){
   currentDate = await getCurrentDate(0);
   startDate = await getCurrentDate(0);
  }

  if(days == 1){
    currentDate = await getCurrentDate(1);
    startDate = await getCurrentDate(1);
   }

   if(days == 7){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(6);
   }

   if(days == 30){
    currentDate = await getCurrentDate(0);
    startDate = await getCurrentDate(29);
   }
  
  try {
    const result = await sequelize2.query(
      `SELECT TIME_FORMAT(SEC_TO_TIME(SUM((da.effort_placed * 60))), '%H:%i:%s') AS idle_time
      FROM days_activities da
      JOIN activity a ON da.activity = a.activity_id
      WHERE a.activity_name = 'Idle'
      AND da.employee = :employeecode
      AND da.day BETWEEN :startDate AND :endDate;
      `,
      {
        replacements: {
          employeecode: employeeCode,
          startDate: startDate,
          endDate: currentDate,
        },
        type: sequelize2.QueryTypes.SELECT,
      }
    );
    if (result[0].idle_time )
    var idle_time = result[0].idle_time;

    else
    idle_time = '00:00:00'

    console.log('*******************idle time******************************************')
    console.log(idle_time);
        console.log('*******************idle time******************************************')

    // else 
    // idle_time = '00:00:00'
    res.json({ idle_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
  };


//***********************LOGIN LOGS API************************ */
exports.createLoginLogs = async (req, res) => {
  try {
    // Get all employees
    const employees = await Employees.findAll();

    // Get the start and end of next month
    const startOfMonth = moment().add('months').startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().add('months').endOf('month').format('YYYY-MM-DD');
    const datesArray = [];

    const holidays = await HolidayMst.findAll({
      where: {
        date: {
          $between: [startOfMonth, endOfMonth] // Fetch holidays between start and end of the month
        }
      }
    });

    const holidayDates = holidays.map(holiday => holiday.date); // Extract holiday dates into an array 
                                                                // map give new array
    // Loop over each day of the month
    for (let date = moment(startOfMonth); date.diff(endOfMonth, 'days') <= 0; date.add(1, 'days')) {
      
      const formattedDate = date.format('YYYY-MM-DD');

      const isHoliday = holidayDates.includes(formattedDate);
      
      // Loop over each employee
      for (const employee of employees) {
        const entry = {
          date: date.format('YYYY-MM-DD'),
          employeecode: employee.id,
          start_time: null,
          end_time: null,
          hours: null,
          weekend: moment(date).day() === 6 || moment(date).day() === 0,
          on_leave: null,
          holiday: isHoliday
        };

        const existingLog = await LoginLogs.findOne({
          where: {
            date: formattedDate,
            employeecode: employee.id
          }
        });
        
        if (!existingLog) {
          // Create a login log entry only if it doesn't exist
          const result = await LoginLogs.create(entry);
          console.log(`Login log entry created: ${JSON.stringify(result)}`);
        } else {
          console.log(`Log entry already exists for ${employee.id} on ${formattedDate}`);
        }
      }
      datesArray.push({ date: date.format('YYYY-MM-DD') });
    }

    res.status(201).json({
      success: true,
      message: 'Dates and login logs for month have been created',
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create dates and login logs for  month',
      error: error.message
    });
  }
};

exports.getLoginLogsDeatils = async (req, res) => {
  try {
    const date = req.body.date;
    console.log("date::", date);
    
    const token = req.headers.authorization;
    const empCode = verifyTokenAndGetId(token);

    sequelize2.query(
      `SELECT * 
        FROM loginlogs 
        WHERE employeecode = :empCode 
          AND YEAR(date) = YEAR(:date) 
          AND MONTH(date) = MONTH(:date)`,
      {
        replacements: { 
          empCode: empCode,
          date: date
        },
        type: sequelize2.QueryTypes.SELECT,
      }
    ).then(result => {
      res.send(result);
    });
      

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to get login logs details',
      error: error.message
    });
  }
}

exports.getAttendanceRegularizationReq = async (req, res) => {

  try {
    const hodId = req.query.hodId;
    const requestDate = req.query.requestDate;
    const token = req.headers.authorization;
    const id = verifyTokenAndGetId(token);
    if (!id) {
      return res.status(401).send({ message: 'Invalid token' });
    }

    let requestRegularization = await attendance_regularization.findAll({
      where: {
        hod_id: hodId,
        isApproved: 'pending',
        [Op.and]: [
          fn('YEAR', col('request_date')), fn('YEAR', fn('STR_TO_DATE', requestDate, '%Y-%m-%d')), // Year from requestDate
          fn('MONTH', col('request_date')), fn('MONTH', fn('STR_TO_DATE', requestDate, '%Y-%m-%d')) // Month from requestDate
        ]
      },
      order: [['request_date', 'DESC']]
    })
    console.log("requestRegularization::", requestRegularization);
      return res.status(200).json({
        resp_status:true, 
        resp_code: 200, 
        resp_msg:"", 
        resp_data: requestRegularization
      })
   
  } catch (error) {
    console.log("error get regularization:", error);
    let failedReason = {
      success: false,
      message: 'Failed to get attendance regularization',
      error: error.message
    }
    res.status(500).json(failedReason)
  }

}

exports.attendanceRegularizationInsert = async (req, res) => {
  try {

    let body = req.body;
    console.log("body::", body);
    const token = req.headers.authorization;
    const id = verifyTokenAndGetId(token);

    console.log("id::", id);
    
    if (!id) {
      res.status(401).send({ message: 'Invalid token' });
    }
    const date = new Date(body.date);

    let isAlreadySubmit = await attendance_regularization.findOne({
      where: { date: date, employeecode: id }
    })
    console.log("isAlreadySubmit:", isAlreadySubmit);    
    if(isAlreadySubmit != null && isAlreadySubmit != undefined){
      if(isAlreadySubmit.isApproved == 'pending' || isAlreadySubmit.isApproved == 'approved'){
        return res.json({ 
          resp_status:true, 
          resp_code: 201, 
          resp_msg:"", 
          resp_data: "Attendance regularization request has already been submitted for this date." })  
      }
    }

    const timestamp = Date.now();
    const randomNumber = crypto.randomInt(100000, 999999);
    const uniqueNumber = `${timestamp}${randomNumber}`;
    const requestPunchInTime = body.requestPunchInTime;
    const requestPunchOutTime = body.requestPunchOutTime;

    const currentDate= new Date();
    const reqCurrentDate=  currentDate.toLocaleDateString('en-CA');

    const mysqlDate = date.toLocaleDateString('en-CA');

    let hodEmail;
    let hodId = await sequelize2.query(`select hod_id from departments where dep_id= :departmentId`,
      {
        replacements: {
          departmentId: body.departmentId
        },
        type: sequelize2.QueryTypes.SELECT
      }
    )
    hodId = hodId[0].hod_id;
    if (hodId) {
      console.log("hodId:", hodId);
      hodEmail = await sequelize2.query(
        `SELECT email_id FROM employees where id= :id`,
        {
          replacements: {
            id: hodId
          },
          type: sequelize2.QueryTypes.SELECT
        }
      )
    }

    const punchInTime24Hour = convertTo24HourFormat(requestPunchInTime);
    const punchOutTime24Hour = convertTo24HourFormat(requestPunchOutTime);

    const punchInDate = new Date(`1970-01-01T${punchInTime24Hour}`);
    const punchOutDate = new Date(`1970-01-01T${punchOutTime24Hour}`);

    const diffMs = punchOutDate.getTime() - punchInDate.getTime();

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    // const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    console.log("Punch In (24-hour format):", punchInTime24Hour);
    console.log("Punch Out (24-hour format):", punchOutTime24Hour);
    console.log("Punch In Date Object:", punchInDate);
    console.log("Punch Out Date Object:", punchOutDate);
    console.log(`Time Difference: ${diffHours} hours and ${diffMinutes} minutes`);

    const insertReqularization = {
      start_time: punchInTime24Hour,
      end_time: punchOutTime24Hour,
      hours: diffHours,
      weekend: false,    
      on_leave: false,    
      holiday: false,       
      date: mysqlDate,
      employeecode: body.empId,
      reason: body.reason,
      req_id: uniqueNumber,
      isApproved: 'pending',
      hod_email: hodEmail[0].email_id,
      hod_id: hodId,
      emp_email: body.requestedEmailId,
      request_date: reqCurrentDate
    };
    const result = await attendance_regularization.create(insertReqularization)
    let approvalUrl = `${config.uiUrl}/attendance-regularization?req_id=${uniqueNumber}`
    let mailOptions = {
      from: `${config.fromName} <${config.fromMail}>`,
      to: hodEmail[0].email_id,
      subject: 'Attendance Regularization Request',
      text: `Attendance Regularization Request Details:
             Employee: ${body.requestedEmailId}
             Date: ${mysqlDate}
             Request Date: ${reqCurrentDate}
             Punch In Time: ${punchInTime24Hour}
             Punch Out Time: ${punchOutTime24Hour}
             Reason: ${body.reason}
             URL to Approve/Reject: ${approvalUrl}`,
      html: `
        <p><b>Attendance Regularization Request Details:</b></p>
        <p><b>Employee Email:</b> ${body.requestedEmailId}</p>
        <p><b>Date:</b> ${mysqlDate}</p>
        <p><b>Request Date:</b> ${reqCurrentDate}</p>
        <p><b>Punch In Time:</b> ${punchInTime24Hour}</p>
        <p><b>Punch Out Time:</b> ${punchOutTime24Hour}</p>
        <p><b>Reason:</b> ${body.reason}</p>
        <p>
          <b>URL to Approve/Reject:</b>
          <a href="${approvalUrl}">Click here to review the request</a>
        </p>
      `
    };

    transportMail(mailOptions)
  .then((info) => {
    console.log("Email sent successfully:", info.response);
  })
  .catch((err) => {
    console.error("Error sending email:", err);
  });

    console.log(`Data insert successfully: ${JSON.stringify(result)}`);
    return res.json({ 
      resp_status:true, 
      resp_code: 200, 
      resp_msg:"", 
      resp_data: result })  
  } catch (error) {
    console.log("error insert regularization:", error);
    let failedReason = {
      success: false,
      message: 'Failed to insert attendance regularization',
      error: error.message
    }
    return res.status(500).json(failedReason)
  }
}

exports.updateAttendanceRegularizationInsert = async (req, res) => {
  try {

    let body = req.body;
    console.log("body::", body);
    const isApproved= body.isApproved;
    let result;
    if(isApproved == 'approved'){
      result= await attendance_regularization.update({isApproved: isApproved, hod_feedback:body.hodFeedback},{
        where : {
          id: body.id,
        }
      });
      console.log("result:", result);      
      if(result){
        let updatedResult= await attendance_regularization.findOne({
          where : {
            id: body.id,
          }
        });
        
        let mailOptions = {
          from: `${config.fromName} <${config.fromMail}>`,
          to: updatedResult.emp_email,
          subject: 'Attendance Regularization Request Approved',
          text: `Attendance Regularization Details:
                 Employee: ${updatedResult.emp_email}
                 Date: ${updatedResult.date}
                 Request Date: ${updatedResult.request_date}
                 Punch In Time: ${updatedResult.start_time}
                 Punch Out Time: ${updatedResult.end_time}
                 Reason: ${updatedResult.reason}
                 Hod Feedback: ${updatedResult.hod_feedback}
                 Approve/Reject: ${updatedResult.isApproved}`,
          html: `
            <p><b>Attendance Regularization Details:</b></p>
            <p><b>Employee Email:</b> ${updatedResult.emp_email}</p>
            <p><b>Date:</b> ${updatedResult.date}</p>
            <p><b>Request Date:</b> ${updatedResult.request_date}</p>
            <p><b>Punch In Time:</b> ${updatedResult.start_time}</p>
            <p><b>Punch Out Time:</b> ${updatedResult.end_time}</p>
            <p><b>Reason:</b> ${updatedResult.reason}</p>
            <p><b>Hod Feedback: </b> ${updatedResult.hod_feedback}</p>
            <p><b>Approve/Reject:</b> ${updatedResult.isApproved}</p>
          `
        };    
        transportMail(mailOptions)
        .then((info) => {
          console.log("Email sent successfully:", info.response);
        })
        .catch((err) => {
          console.error("Error sending email:", err);
        });

        await LoginLogs.update(
          {
            start_time:updatedResult.start_time,
            end_time: updatedResult.end_time,
            hours:updatedResult.hours},{
            where : {
              date: updatedResult.date,
              employeecode: updatedResult.employeecode
            }
        });
      }
    }
    else if(isApproved == 'reject'){
      result= await attendance_regularization.update({isApproved: isApproved, hod_feedback:body.hodFeedback},{
        where : {
          id: body.id,
        }
      });
      if(result){
        let updatedResult= await attendance_regularization.findOne({
          where : {
            id: body.id,
          }
        });
        
        let mailOptions = {
          from: `${config.fromName} <${config.fromMail}>`,
          to: updatedResult.emp_email,
          subject: 'Attendance Regularization Request Reject',
          text: `Attendance Regularization Details:
                 Employee: ${updatedResult.emp_email}
                 Date: ${updatedResult.date}
                 Request Date: ${updatedResult.request_date}
                 Punch In Time: ${updatedResult.start_time}
                 Punch Out Time: ${updatedResult.end_time}
                 Reason: ${updatedResult.reason}
                 Hod Feedback: ${updatedResult.hod_feedback}
                 Approve/Reject: ${updatedResult.isApproved}`,
          html: `
            <p><b>Attendance Regularization Details:</b></p>
            <p><b>Employee Email:</b> ${updatedResult.emp_email}</p>
            <p><b>Date:</b> ${updatedResult.date}</p>
            <p><b>Request Date:</b> ${updatedResult.request_date}</p>
            <p><b>Punch In Time:</b> ${updatedResult.start_time}</p>
            <p><b>Punch Out Time:</b> ${updatedResult.end_time}</p>
            <p><b>Reason:</b> ${updatedResult.reason}</p>
             <p><b>Hod Feedback: </b> ${updatedResult.hod_feedback}</p>
            <p><b>Approve/Reject:</b> ${updatedResult.isApproved}</p>
          `
        };    
        transportMail(mailOptions)
        .then((info) => {
          console.log("Email sent successfully:", info.response);
        })
        .catch((err) => {
          console.error("Error sending email:", err);
        });

      }
    }
    return res.json({
      resp_status:true, 
      resp_code: 200, 
      resp_msg:"", 
      resp_data: "Record is updated!"
    });
    
  } catch (error) {
    console.log("error update regularization record:", error);
    let failedReason = {
      success: false,
      message: 'Failed to update attendance regularization record',
      error: error.message
    }
    res.status(500).json(failedReason)
  }
}

exports.isApprovedAttendance = async (req, res) => {
  try {
    let req_id= req.query.req_id;
    console.log("body::", req_id);
    const isAlreadyApproved = await attendance_regularization.findOne({
      where: { req_id: req_id},
      attributes: ['isApproved']
    })

    console.log("isAlreadyApproved::", isAlreadyApproved);    

    if(isAlreadyApproved.isApproved == 'approved' || isAlreadyApproved.isApproved == 'reject'){
      return res.status(200).json(
        {
          resp_status:true, 
          resp_code: 201, 
          resp_msg:"", 
          resp_data: "Already submitted"
      });
    }
    else{
      let requestRegularizationInfo =await attendance_regularization.findOne({
        where: { req_id: req_id}
      })
      return res.status(200).json({
        resp_status:true, 
        resp_code: 200, 
        resp_msg:"", 
        requestRegularizationInfo
      })
    }
    
  } catch (error) {
    console.log("error update regularization record:", error);
    let failedReason = {
      success: false,
      message: 'Failed to update attendance regularization record',
      error: error.message
    }
    res.status(500).json(failedReason)
  }
}

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employees.findAll({
      where: {
        enabled: 1,
      },
      attributes: ['id', 'first_name', 'last_name', 'email_id', 'username'],
    });
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

function padZero(value) {
  return value.toString().padStart(2, '0');
}

function convertTo24HourFormat(time) {
  // Convert 12-hour time format (e.g., "10:00 AM") to 24-hour format
  const [timePart, modifier] = time.split(' ');

  let [hours, minutes] = timePart.split(':');
  hours = padZero(hours);
  if (modifier === 'PM' && hours !== '12') {
    hours = String(Number(hours) + 12);
  } else if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours}:${minutes}:00`;
}