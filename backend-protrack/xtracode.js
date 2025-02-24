// const tokenParts = token.split(' ');
    // if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    //   return res.status(401).send({ message: 'Invalid token format' });
    // }

// const { LoginLogs } = require(".")

    // const decoded = jwt.verify(tokenParts[1], JWT_SECRET);
    // const empcode = decoded.id;

    // console.log(empcode + " empcode from punchin");































    app.post('/punchinTime2', async (req, res) => {
      const { punchInTime } = req.body

      try {
        const token = req.headers.authorization
        if (!token) {
          return res.status(401).send({ message: 'Token missing' })
        }
    
        const empcode = verifyTokenAndGetId(token)
        console.log(empcode + 'empcode from punchin')
    
        
        const mysqlDateString = await getCurrentDate(0);
    
        // const mysqlDateString = currentDate.toISOString().slice(0, 10)
    
        const mysqlTime = loginTime.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
    
    
       LoginLogs.update({start_time: mysqlTime},{
        where : {
          employeecode:  empcode,
          date: mysqlDateString
        }
      }).then(() => {
        console.log('Start time updated successfully.');
      }).catch((error) => {
        console.error('Error updating start time:', error);
      });
        

      } catch (error) {
        console.error('Error verifying token:', error)
        res.status(401).send({
          message: 'Invalid token'
        }) // send a response to the client indicating failure
      }
    })


    exports.decryptEmployeecode = async(req, res, next)=> {
  // const token = req.headers.authorization;

  // console.log("this is token received from authorisation header before split"+ token)
  // const token  = req.headers.authorization.split(' ')[1];
  const token = req.headers.authorization
  console.log('this is token received from authorisation header after split' + token)
  try {
    console.log('try start')
    const token2 = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token2, JWT_SECRET)
    // console.log(jwt.verify(token, JWT_SECRET));
    console.log('try second')
    req.employeecode = decoded.employeecode
    console.log(req.employeecode)
    next()
  } catch (err) {
    console.log('decryptemployeecode is caught')
    return res.status(401).json({ message: 'Invalid token' })
  }
}




















async function getReport(empCode, days) {
  const currentDate = new Date();
  const endDate = new Date(currentDate.getTime() - (days * 24 * 60 * 60 * 1000));
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0, 0);

  const reportData = await sequelize2.query(`
    SELECT 
      date,
      start_time,
      end_time,
      SUM(CASE WHEN a.useful = 1 THEN da.effort_placed ELSE 0 END) AS productive_time,
      SUM(CASE WHEN a.useful = 0 THEN da.effort_placed ELSE 0 END) AS non_productive_time,
      SUM(CASE WHEN activity = :idleActivityId THEN da.effort_placed ELSE 0 END) AS idle_time,
      TIMESTAMPDIFF(MINUTE, start_time, end_time) AS total_time,
      (SUM(CASE WHEN a.useful = 1 THEN da.effort_placed ELSE 0 END) / (9 * 60) * 100) AS productive_percentage,
      (SELECT holiday FROM holidays WHERE date = DATE_FORMAT(days.date, '%Y-%m-%d')) AS is_holiday,
      (SELECT on_leave FROM leaves WHERE employee = :empCode AND start_date <= days.date AND end_date >= days.date) AS is_on_leave
    FROM
      days
      LEFT JOIN days_activities da ON days.id = da.day
      LEFT JOIN activity a ON da.activity = a.activity_id
    WHERE
      days.employee = :empCode AND date BETWEEN :startDate AND :endDate
    GROUP BY
      date
  `, {
    replacements: {
      empCode,
      idleActivityId: 1, // replace with the correct idle activity id
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    type: sequelize2.QueryTypes.SELECT
  });

  return reportData;
}



// SQL QUERY FOR THE REPORT
`
SELECT 
    loginlogs.date,
    loginlogs.start_time,
    loginlogs.end_time,
    SEC_TO_TIME(TIMESTAMPDIFF(SECOND, loginlogs.start_time, loginlogs.end_time)) AS total_time,
    SUM(CASE WHEN activity.useful = 1 THEN days_activities.effort_placed ELSE 0 END) AS productive_time,
    SUM(CASE WHEN activity.useful = 0 THEN days_activities.effort_placed ELSE 0 END) AS non_productive_time,
    SUM(CASE WHEN activity.activity_id = 6 THEN days_activities.effort_placed ELSE 0 END) AS idle_time,
    (SUM(CASE WHEN activity.useful = 1 THEN days_activities.effort_placed ELSE 0 END) / (9 * 60) * 100) AS productive_percentage,
    loginlogs.holiday AS is_holiday,
    loginlogs.on_leave AS is_on_leave
FROM 
    loginlogs
LEFT JOIN 
    days_activities ON loginlogs.date = days_activities.day
LEFT JOIN 
    activity ON days_activities.activity = activity.activity_id
WHERE 
    loginlogs.employeecode = 10 AND loginlogs.date BETWEEN DATE_SUB('2023-04-12', INTERVAL 7 DAY) AND '2023-04-12'
GROUP BY 
    loginlogs.date;
`



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
    loginlogs.employeecode = 10 AND loginlogs.date BETWEEN DATE_SUB('2023-04-12', INTERVAL 7 DAY) AND '2023-04-12'
GROUP BY 
    loginlogs.date;
`




app.get('/report/:days', async (req, res) => {

  // api returns data from current date to previous pararam :days

  const days = parseInt(req.params.days);
  const token = req.headers.authorization;
  const empCode = verifyTokenAndGetId(token);
  const reportArray = [];

    // create the report object for the current day
    const reportObj = {
      date: 
      startTime: 
      endTime: 
      productiveTime:  
      nonProductiveTime: 
      productivePercentage: 
      idleTime:  
      totalTime: 
      onLeave: 
      holiday: 
    };

    // add the report object to the report array
    reportArray.push(reportObj);
  

  // send the report array as the response
  res.json(reportArray);
});


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
    loginlogs.employeecode = 10 AND loginlogs.date BETWEEN DATE_SUB('2023-04-12', INTERVAL 7 DAY) AND '2023-04-12'
GROUP BY 
    loginlogs.date;


    SELECT 
        SUM(CASE WHEN activity.activity_id = (SELECT activity_id FROM activity WHERE activity_name = 'Idle') THEN days_activities.effort_placed ELSE 0 END) AS idle_time

    FROM
        loginlogs

    LEFT JOIN 
        days_activities ON loginlogs.date = days_activities.day

    LEFT JOIN 
        activity ON days_activities.activity = activity.activity_id
        
    WHERE 
        loginlogs.employeecode = 10 AND loginlogs.date BETWEEN DATE_SUB('2023-04-13', INTERVAL 10 DAY) AND '2023-04-12'


    GROUP BY 
        loginlogs.date;
        




        SELECT 
        SUM(CASE WHEN activity.activity_id = (SELECT activity_id FROM activity WHERE activity_name = 'Idle') THEN days_activities.effort_placed ELSE 0 END) AS idle_time

    FROM
        loginlogs

        WHERE 
        loginlogs.employeecode = 10 AND loginlogs.date BETWEEN DATE_SUB('2023-04-13', INTERVAL 10 DAY) AND '2023-04-12';
