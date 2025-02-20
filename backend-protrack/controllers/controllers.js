
const sequelize2 = require('../config/db');
const Employees  = require('../models/Employees');
const Activity   = require('../models/Activity');
const LoginLogs  = require('../models/LoginLogs');
const Projects   = require('../models/Projects');
const moment = require('moment')
const { getCurrentDate, verifyTokenAndGetId } = require('./helpers');
const jwt = require('jsonwebtoken');

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
    try {
      const employee = await Employees.findOne({
        where: { username:employee_code }
      });
      if (!employee) {
        return res.status(400).send({ message: 'Invalid employee code' });  
      }
      if (employee.password !== password) {
        return res.status(400).send({ message: 'Invalid password' });
      }
      const token = jwt.sign({ id: employee.id }, JWT_SECRET, { expiresIn: '1d' });
      res.status(200).send({ token });
      console.log(req.body);
      
          
      
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: 'Server error' });
      
    }
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

    await LoginLogs.update({start_time: mysqlTime},{
      where : {
        employeecode:  empcode,
        date: mysqlDateString
      }
    });

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

    await LoginLogs.update({end_time: mysqlTime},{
      where : {
        employeecode:  empcode,
        date: mysqlDateString
      }
    });

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
    const mysqlDateString = getCurrentDate(0);
    const inputs = req.body.inputs;

    if (!inputs || !Array.isArray(inputs)) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    const token = req.headers.authorization;
    const empcode = await verifyTokenAndGetId(token);

    const date3 = await getCurrentDate(0);

    const query = `
      INSERT INTO days_activities (activity, effort_placed, description, employee, day)
      VALUES ${inputs.map(input => `(
        (SELECT activity_id FROM activity WHERE activity_name = '${input.activity}'),
        ${input.time},
        '${input.description}',
        ${empcode},
        '${date3}'
      )`).join(', ')}
    `;

    await sequelize2.query(query, { type: sequelize2.QueryTypes.INSERT });

    res.status(201).json({ message: 'Records created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while creating records' });
  }
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


// GETS THE BASIC ATTENDANCE DATA
exports.generateTimeEntries = async(req, res) =>{

    const token = req.headers.authorization
  const empcode = verifyTokenAndGetId(token)
  console.log(empcode + ' employeecode from /timeEntries')
  if (!empcode) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  var timeEntries = []

  for (let i = 0; i < 10; i++) {
    // const date = new Date(currentDate)
    // date.setDate(date.getDate() - i)

    const mysqlDate =  await getCurrentDate(i);  

    console.log(mysqlDate + ' mysqlDate');
   
    const timeEntry = {
      'S. No.': (i + 1).toString(),
      'Date': mysqlDate,
      'Punch In': '---',
      'Punch Out': '---',
      'Project 1': '---',
      'Project 2': '---',
      'Project 3': '---'
    }

    try {
      const loginLog = await LoginLogs.findOne({
        where: { employeecode: empcode, date: mysqlDate},
        attributes: ['start_time', 'end_time']
      })

      if (loginLog) {
        if (loginLog.start_time) {
          timeEntry['Punch In'] = loginLog.start_time
          
        }

        if (loginLog.end_time) {
          timeEntry['Punch Out'] = loginLog.end_time
        }
      }
    } catch (error) {
      console.error(error)
    }

    timeEntries.push(timeEntry)

    

}

res.json(timeEntries)
}

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
      `SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_time,start_time)))) AS total_time
       FROM loginlogs
       WHERE employeecode = :employeecode
       AND date >= :startDate
       AND date <= :endDate`,
      {
        replacements: {
          employeecode: employeeCode,
          startDate: startDate,
          endDate: currentDate,
        },
        type: sequelize2.QueryTypes.SELECT,
      }
    );
    if (result[0].total_time)
    total_time = result[0].total_time;

    else 
    var  total_time = '00:00:00'

  
    res.json({ total_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};


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

    // Loop over each day of the month
    for (let date = moment(startOfMonth); date.diff(endOfMonth, 'days') <= 0; date.add(1, 'days')) {
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
          holiday: moment(date).day() === 6 || moment(date).day() === 0
        };
        // Create a login log entry for the current day and employee
        const result = await LoginLogs.create(entry);
        console.log(`Login log entry created: ${JSON.stringify(result)}`);
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