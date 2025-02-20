// boiler plate chat gpt

const express = require('express')
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes/router')




require('./controllers/controllers')
// import models
// const Employees = require('./models/employees')
const Projects = require('./models/Projects')
const Activity = require('./models/Activity')
// const DaysActivities = require('./models/DaysActivities')
const LoginLogs = require('./models/LoginLogs')


require('dotenv').config()

// setting cors
app.use(cors())
const sequelize2 =  require('./config/db')

Activity.belongsTo(Projects, { foreignKey: 'proj_id', as: 'project' })
Projects.hasMany(Activity, { foreignKey: 'proj_id', as: 'activities' })




const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

sequelize2
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

app.use(bodyParser.json())
app.use('/', routes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// self
function verifyTokenAndGetId (token) {

  if (!token) {
    return null
  }

  const tokenParts = token.split(' ')
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    // return res.status(401).send({ message: 'Invalid token format' });
    return null
  }

  const decoded = jwt.verify(tokenParts[1], JWT_SECRET)
  // const empcode = decoded.id;

  console.log("just checking if verifyTokenAnd Get id is reaching till before return");
  console.log(decoded.id)

  return decoded.id
}

async function getCurrentDate(index) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - index);
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);

  console.log(`${year}-${month}-${day}`)
  console.log("date")
  return `${year}-${month}-${day}`;
}

//self
app.get('/duration/:days', async (req, res) => {
  const { days } = req.params;
  const token = req.headers.authorization;
  const employeeCode = verifyTokenAndGetId(token);
  
  const currentDate = await getCurrentDate(0);
  const startDate = await getCurrentDate(days-1);
  
  try {
    const result = await sequelize2.query(
      `SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)))) AS total_duration 
       FROM loginlogs 
       WHERE employeecode = :employeeCode 
       AND date BETWEEN :startDate AND :endDate`,
      {
        replacements: { 
          employeeCode,
          startDate,
          endDate: currentDate
        },
        type: sequelize2.QueryTypes.SELECT
      }
    )
    
    if (result && result.length > 0) {
      const totalDuration = result[0].total_duration;
      res.json({ totalDuration })
    } else {
      res.status(404).json({ message: 'Duration not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})



app.get('/idleminutes/:days', async (req, res) => {

  const { days } = req.params;
  const token = req.headers.authorization;
  const employeeCode = verifyTokenAndGetId(token);
  
  const currentDate = getCurrentDate(0);
  const startDate   = getCurrentDate(days-1);
  

  try{

  }catch(err){

    console.log(err)
    res.status(500).json({message:'Internal Server Error'})

  }




})



app.get('/fetchpunchinout2', async (req, res) => {
  //1. verify and get token id.
  //2. query loginlogs for punchin and punchout for that employee for current date.
  //4. send the data received  to the client.
  const token = req.headers.authorization;
  if(!token) {
    res.send('No token found');
    return;
  }
  
  const empcode = await verifyTokenAndGetId(token);
  const currentDate = new Date().toISOString().slice(0, 10); // get current date in yyyy-mm-dd format
  
  const data = {
    'punchIn': null,
    'punchOut': null
  };

  try {
    const loginLog = await LoginLogs.findOne({
      where: { employeecode: empcode, date: currentDate },
      attributes: ['start_time', 'end_time']
    });

    if (loginLog) {
      if (loginLog.start_time) {
        data.punchIn = login.start_time;
      }
      if (loginLog.end_time) {
        data.punchOut = login.end_time;
      }
      const jsonData = JSON.stringify(data);
      console.log('json data loginlogs ' + jsonData);
    }
  } catch (error) {
    console.error(error);
  }

  // Get start_day and end_day for requested employee
  const employeeAttendance = await LoginLogs.findOne({
    where: { date: currentDate, employeecode: empcode }
  });

  if (!employeeAttendance) {
    res.json({ start_day: null, end_day: null });
    return;
  }

  res.json({
    start_day: employeeAttendance.start_time,
    end_day: employeeAttendance.end_time
  });
});



app.get('/unproductivetime/:days', async (req, res) =>{

})

app.get('/productivetime/:days', async (req, res) =>{


})

app.get ('/learningtime/:days', async (req, res) =>{

})

app.get ('/breaktime/:days', async (req,res) =>{


})


async function getCurrentDate(index) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - index);
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);

  console.log(`${year}-${month}-${day}`)
  console.log("date")

  
  return `${year}-${month}-${day}`;
}

app.get('/totalDurationLastWeek', async (req, res) => {
  const token = req.headers.authorization
  const employeeCode = verifyTokenAndGetId(token)
  const { Op } = sequelize2.Sequelize

  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const startOfLastWeek = new Date(startOfToday - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)

  try {
    const totalDuration = await LoginLogs.findOne({
      attributes: [
        [
          sequelize2.literal(
            'TIME_FORMAT(SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)))), "%kh %im")'
          ),
          'totalDuration'
        ],
      ],
      where: {
        employeecode: employeeCode,
        date: {
          [Op.between]: [startOfLastWeek, startOfToday]
        },
      }
    })
    if (totalDuration) {
      res.json({ totalDuration: totalDuration.totalDuration })
    } else {
      res.status(404).json({ message: 'Duration not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})