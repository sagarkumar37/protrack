const sequelize2 = require('../config/db');
const Employees  = require('../models/Employees');
const Activity   = require('../models/Activity');
const LoginLogs  = require('../models/LoginLogs');
const Projects   = require('../models/Projects');

const moment     = require('moment')
const { getCurrentDate, verifyTokenAndGetId } = require('./helpers');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const Joi = require('joi');
// Import the models from the work-report folder

const DaysActivities = require('../models/DaysActivities');
const WeeklyRating = require('../models/work-report/WeeklyRating');
const WeeklyTaskReports = require('../models/work-report/WeeklyTaskReports');
const WeeklyPlanReports = require('../models/work-report/week_plan');
const { get } = require('config');




exports.checkAdmin = async (req,res,next) =>{

    try{

        if(!req.headers.authorization)
        return res.status(400).send({message:"Missing token"})

        const token = req.headers.authorization;
        const employee_id = verifyTokenAndGetId(token);

        if(!employee_id)
        { return res.status(400).send({message:"Missing token"})}


        const employee = await Employees.findOne({
            where: { id: employee_id },
                attributes: ['id', 'role'], // Only fetch 'id' and 'role' fields
            });

            //return the resposne
    }
    catch(error){
            return res.status(500).send({message:"Internal Server Error"});
    }
}
exports.checkEmployeeRole = async (req, res) => {
    try {
        // Get employee ID from request parameters or body
        if(!req.headers.authorization)
        return res.status(401).send({message:"Unauthorized"});
  
        const token = req.headers.authorization;
        const employee_id = verifyTokenAndGetId(token);

        if(!employee_id)
        { return res.status(400).send({message:"Missing token"})}

         const employee = await Employees.findOne({
           where: { id: employee_id },
            attributes: ['id', 'role'], // Only fetch 'id' and 'role' fields
        });
  
         if (!employee) {
         return res.status(404).json({ message: 'Employee not found' });
         }
        // Return the role of the employee
      return res.status(200).json({ message: "Role Found",role: employee.role });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.fetchEmployees = async (req,res) =>{
    try{
        
        if(!req.headers.authorization)
        {return res.status(404).send({message: "Missing Token"})}

        const employees = await Employees.findAll({
            attributes: ['username'],
          });
      
          // Extract usernames into an array
          const usernames = employees.map(employee => employee.username);
        //   usernames.push("All Employees");
          usernames.sort();

          // Send the usernames as a JSON response
          res.status(200).json({
            success: true,
            usernames
          });
    }
    catch(error){
        return res.status(500).send({message:"Internal Server Error"})
    }
};
exports.adminWeekReportRouteAccess = async (req,res) =>{

    if(!req.params)
    return res.status()


};

exports.adminfetchWeeklyReport = async(req, res) => {
    try{
        const{
            weekDate,
            employee
        }   = req.body;

        const date = moment(weekDate).format('YYYYMMDD');
        const year_week = parseInt(moment(date).format('YYYYWW'));
        console.log(`${year_week} year_week`);

        const token = req.headers.authorization;

        const id = verifyTokenAndGetId(token);
        if(!id)
        {return res.status(401).send({message:"Unauthorised error"})}


        if(employee==="All Employees"){ 

        console.log("All EmployeeS EXEUETED))))))))))))))))))))")

            const result = await adminAllEmployeeReport(date);

            console.log(result+" result");
            return res.status(200).send({message:"Records fetched successfully for all employees",
            result: result})

        
        }

        const selected_employee = await Employees.findOne({
            where:{
                username: employee
            }
        });
        const ratings = await  WeeklyRating.findOne({
            attributes: ['busyness', 'satisfaction', 'learning', 'core', 'skill_acquired', 'ai_productivity'],
            where:{
                employee_id: selected_employee.id,
                year_week: year_week
            }
        })

        console.log(`${JSON.stringify(ratings)} ratings`);

        const rating={
            busyness:           ratings.busyness,
            satisfaction:       ratings.satisfaction,
            learning:           ratings.learning,
            core:               ratings.core,
            skillAcquired:      ratings.skill_acquired,
            aiProductivity:     ratings.ai_productivity
        }


        const weekly_plans = await week_plan.findAll({
            attributes: ['task_description','status'],
            where:{
                employee_id: employee_id,
                year_week: year_week
            }
        })
        const planObjects = [];

        weekly_plans.forEach(plan => {

                const planObject ={
                    plan:           plan.task_description,
                    status:         plan.status,
                    //challenge:      task.challenge_description,
                    //aiTool:         task.ai_tool
                }

                planObjects.push(planObject);
        });

        const weekly_tasks = await WeeklyTaskReports.findAll({
            attributes: ['task_description','status','challenge_description','ai_tool'],
            where:{
                employee_id:    selected_employee.id,
                year_week:      year_week
            }

        })

        const taskObjects = [];

        weekly_tasks.forEach(task => {

                const taskObject ={
                    task:           task.task_description,
                    status:         task.status,
                    challenge:      task.challenge_description,
                    aiTool:         task.ai_tool
                }
                taskObjects.push(taskObject);
        });

        const statusOrder = ['Planned', 'In Progress', 'Completed'];
        taskObjects.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

        // console.log(JSON.stringify(taskObjects) + "  taskObjects(((((((((((((((((((((()))))))))))))))");


        console.log(ratings);
        console.log(weekly_tasks);
        console.log(weekly_plans);

        const week_task = JSON.stringify(taskObjects);

        return res.status(200).send({message:"OK",
                                     ratings: rating,
                                     tasks: taskObjects})



        return res.status(200).send({message:"OK", request_body: req.body});

        console.log(req.body);

        if(!req.headers.authorization)
        {return res.status(401).send({message:"Missing Token"})}    

        // if(!req.params)
        // {return res.status(400).send({message: "Misssing Params"})}
        

        
        // const employee_id= verifyTokenAndGetId(token);
        console.log(token);


        // extract year_week from weekDate
        

        // const year_week = parseInt(req.params.year_week )-1;
        console.log(year_week+" year_week");
    }catch(error){
        console.log(error.details);
        return res.status(500).send({message:"An Internal Server Error"})
    }

}

async function adminAllEmployeeReport(date) {
    try{
        const year_week = parseInt(moment(date).format('YYYYWW'));
        const employees = await Employees.findAll({
            attributes: ['id', 'username'],
            where: {
                role: 'user'
            }
        });
        const employee_ids = employees.map(employee => employee.id);
        const ratings = await WeeklyRating.findAll({
            attributes: ['employee_id', 'busyness', 'satisfaction', 'learning', 'core', 'skill_acquired', 'ai_productivity','year_week'],
            where: {
                employee_id: employee_ids,
                year_week: year_week
            }
        });
        const plans = await WeeklyPlanReports.findAll({
            attributes: ['employee_id', 'task_description', 'status','year_week'],
            where: {
                employee_id: employee_ids,
                year_week: year_week
            }
        });
        const tasks = await WeeklyTaskReports.findAll({
            attributes: ['employee_id', 'task_description', 'status', 'challenge_description', 'ai_tool','year_week'],
            where: {
                employee_id: employee_ids,
                year_week: year_week
            }
        });
        const employee_ratings = {};
        const employee_tasks = {};
        const employee_plan ={};
        employees.forEach(employee => {
            employee_ratings[employee.username] = {
                busyness: 0,
                satisfaction: 0,
                learning: 0,
                core: 0,
                skillAcquired: 0,
                aiProductivity: 0,
                year_week: 0
            };
            employee_tasks[employee.username] = [];
            employee_plan[employee.username]=[];
        });
        ratings.forEach(rating => {
            employee_ratings[employees.find(employee => employee.id === rating.employee_id).username] = {
                busyness: rating.busyness,
                satisfaction: rating.satisfaction,
                learning: rating.learning,
                core: rating.core,
                skillAcquired: rating.skill_acquired,
                aiProductivity: rating.ai_productivity,
                year_week: rating.year_week
            };
        });
        plans.forEach(plan => {
            employee_plan[employees.find(employee => employee.id === plan.employee_id).username].push({
                task: plan.task_description,
                status: plan.status
                
            });
        });
        tasks.forEach(task => {
            employee_tasks[employees.find(employee => employee.id === task.employee_id).username].push({
                task: task.task_description,
                status: task.status,
                challenge: task.challenge_description,
                aiTool: task.ai_tool
            });
        });
        const statusOrder = ['Planned', 'In Progress', 'Completed'];
        Object.keys(employee_tasks).forEach(employee => {
            employee_tasks[employee].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
        });
        console.log('employee_ratings++++++++++++++++++++++++++++++ '+JSON.stringify(employee_ratings));
        console.log('employee_tasks++++++++++++++++++++++++++++++ ' + JSON.stringify(employee_tasks));
        console.log('employee_tasks++++++++++++++++++++++++++++++ ' + JSON.stringify(employee_plan));
        return {
            ratings: employee_ratings,
            tasks: employee_tasks,
            plans:employee_plan
        };
    }catch(error){
        console.log(error);
    }
}

exports.masterWeekReport = async(req, res) => {
    try{

        if(Object.keys(req.body).length === 0){
            return res.status(400).send({message:"Missing Request Body"});
        }
        const {
            startDate,
            endDate,
            userName
        } = req.body;


        if (!userName || !Array.isArray(userName) || userName.length === 0) {
            return res.status(500).send({ message: "Empty UserName in payload" });
          }

        // convert the startDate and endDate to YYYYWW format
        const start_date = moment(startDate).format('YYYYWW');
        const end_date = moment(endDate).format('YYYYWW');
        /**
         payloadformat
         {
            "startDate":    "",
            "endDate":      "",
            "userNames":    ["", ""],
         }
         */

        if(!req.headers.authorization)
        {return res.status(401).send({message:"Missing Token"})}

        const token = req.headers.authorization;
        const employee_id = verifyTokenAndGetId(token);

        const ratingsData = await getWeeklyRatings(start_date, end_date, userName);
        console.log(ratingsData)
        //raksha
        const plansData =await getWeeklyPlans(start_date, end_date,userName); 
        const tasksData =   await getWeeklyTasks(start_date, end_date, userName);
          
        return res.status(200).send({message:"OK", ratingsData, plansData, tasksData});


    }
    catch(error){
            console.log(error);
            return res.status(500).send({message:"Internal Server Error"});
    }
}

const getWeeklyRatings = async (startDate, endDate, userNames) => {

    console.log(`startDate ${startDate}\n endDate ${endDate}\n userNames ${userNames}`)
    const query = `
      SELECT 
        employees.username,
        weekly_ratings.busyness, 
        weekly_ratings.satisfaction,
        weekly_ratings.learning,
        weekly_ratings.core,
        weekly_ratings.ai_productivity,
        weekly_ratings.skill_acquired,
        weekly_ratings.year_week
      FROM weekly_ratings
      LEFT OUTER JOIN employees
      ON employees.id = weekly_ratings.employee_id
      WHERE weekly_ratings.year_week BETWEEN :startDate AND :endDate
      AND employees.username IN (:userNames)
      order BY year_week,username;

    `;
    const replacements = { startDate, endDate, userNames };
  
    const result = await sequelize2.query(query, {
      replacements,
      type: sequelize2.QueryTypes.SELECT
    });

    // console.log(result);
    return result;
  };


const getWeeklyTasks = async (startDate, endDate, userNames) =>{
    const query = `
    SELECT 
        employees.username,
        weekly_task_reports.task_description,
        weekly_task_reports.status,
        weekly_task_reports.challenge_description,
        weekly_task_reports.ai_tool,
        weekly_task_reports.year_week,
        activity.activity_name
    FROM weekly_task_reports
    LEFT OUTER JOIN employees
        ON employees.id = weekly_task_reports.employee_id
    LEFT OUTER JOIN activity
        ON activity.activity_id = weekly_task_reports.activity_id
    WHERE weekly_task_reports.year_week BETWEEN :startDate AND :endDate
    AND employees.username IN (:userNames)
    ORDER BY 
    year_week, 
    username,
    CASE weekly_task_reports.status
        WHEN 'Planned' THEN 1
        WHEN 'In Progress' THEN 2
        WHEN 'Completed' THEN 3
        ELSE 4
    END;
    `;

    
    const replacements = { startDate, endDate, userNames };

    const result = await sequelize2.query(query, {
        replacements,
        type: sequelize2.QueryTypes.SELECT
    });


    console.log(`result of getWeeklyTasks`);
    console.log(result);
    return result;

}
const getWeeklyPlans = async (startDate, endDate, userNames) =>{
    const query = `
    SELECT 
    employees.username,
        weekly_plan_reports_v2.activity_id,
        weekly_plan_reports_v2.task_description,    
        weekly_plan_reports_v2.status,
        weekly_plan_reports_v2.year_week,
        weekly_plan_reports_v2.due_date,
        activity.activity_name
    FROM weekly_plan_reports_v2
    LEFT OUTER JOIN employees
        ON employees.id = weekly_plan_reports_v2.employee_id
    LEFT OUTER JOIN activity
        ON activity.activity_id = weekly_plan_reports_v2.activity_id
    WHERE weekly_plan_reports_v2.year_week BETWEEN :startDate AND :endDate
    AND employees.username IN (:userNames)
    ORDER BY 
    year_week, 
    username
    `;

    const replacements = { startDate, endDate, userNames };
    const result = await sequelize2.query(query, {
        replacements,
        type: sequelize2.QueryTypes.SELECT
    }); 

    console.log(result);
    return result;

}


exports.employeeWeekReport = async(req, res) => {
    try{

        if(Object.keys(req.body).length === 0){
            return res.status(400).send({message:"Missing Request Body"});
        }
        const {
            startDate,
            endDate,
            
        } = req.body;


        // if (!userName || !Array.isArray(userName) || userName.length === 0) {
        //     return res.status(500).send({ message: "Empty UserName in payload" });
        //   }

        // convert the startDate and endDate to YYYYWW format
        const start_date = moment(startDate).format('GGGGWW');
        const end_date   = moment(endDate).format('GGGGWW');
        /**
         payloadformat
         {
            "startDate":    "",
            "endDate":      "",
            "userNames":    ["", ""],
         }
         */

        if(!req.headers.authorization)
        {return res.status(401).send({message:"Missing Token"})}

        const token = req.headers.authorization;
        const employee_id = verifyTokenAndGetId(token);

        const employee = await Employees.findOne({
            where: { id: employee_id },
                attributes: ['username','id', 'role'], // Only fetch 'id' and 'role' fields
            });

            const userName= employee.username;

        const ratingsData = await getWeeklyRatings(start_date, end_date, userName);
        const tasksData =   await getWeeklyTasks(start_date, end_date, userName);
        const planData = await getWeeklyPlans(start_date, end_date, userName);  
        return res.status(200).send({message:"OK",payload: ratingsData, tasksData, planData});


    }
    catch(error){
            console.log(error);
            return res.status(500).send({message:"Internal Server Error"});
    }
}

