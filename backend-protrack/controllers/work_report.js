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
const week_plan = require('../models/work-report/week_plan');


// Write a controller function to test the models of the work report
exports.testModels = async (req, res) => {

    try {
         // extract the param from the apiurl
    const { param } = req.params;
    let response;

        // if(param === "weekmst"){
        // response = await WeekMst.findAll();
        // }

        // if(param === "employee-weekmst"){
        //     response = await EmployeeWeekMst.findAll();
        // }

        // if(param === "activity-employee-weekmst"){
        //     response = await ActivityEmployeeWeekMst.findAll();
        // }

        // send response
        res.status(200).json({ message: "Success", data: response });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }


}

const calculateWeekDates = (year) => {
    

    const weeks = [];
    let currentDate = moment().year(year).month(0).startOf('isoWeek');
  
    while (currentDate.year() === year) {

      const weekStart = currentDate.clone().format('DD/MM/YYYY');
      const weekEnd = currentDate.clone().add(6, 'days').format('DD/MM/YYYY');
      weeks.push(`Week ${currentDate.isoWeek()} (${weekStart} - ${weekEnd})`);
      currentDate.add(7, 'days');

    }
  
    return weeks;
  };
  
exports.weeksDropdown = async (req, res) => {
    const { params } = req.params;
    const year = parseInt(params, 10);
  
    if (isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year provided.' });
    }
  
    const weeks = calculateWeekDates(year);
    
    const response = weeks.reduce((acc, week, index) => {
      acc[`Week ${index + 1}`] = week;
      return acc;
    }, {});
  
    res.json(response);
};




exports.fetchWeeklyDescriptions =  async (req, res) => {
    try {

        const activity =req.body;
        if (!req.headers.authorization) {
            return res.status(401).send('Missing Token');
        }

        if (!req.params.year_week) {
            return res.status(400).send('Missing Request Params');
        }

        const token = req.headers.authorization;
        const id = verifyTokenAndGetId(token);

        const { year_week } = req.params;
        const yearWeekMoment = moment(year_week, 'YYYYWW');

        const t_week_start = yearWeekMoment.startOf('week').toDate();
        const t_week_end = yearWeekMoment.endOf('week').toDate();

        const week_start = moment(t_week_start).format('YYYY-MM-DD');
        const week_end = moment(t_week_end).format('YYYY-MM-DD');

        const sqlQuery = `
            SELECT DISTINCT a.activity_name
            FROM days_activities da
            INNER JOIN Activity a ON da.activity = a.activity_id
            WHERE da.employee = :employee
            AND da.day BETWEEN :week_start AND :week_end
        `;

        const activities = await sequelize2.query(sqlQuery, {
            replacements: { employee: id, week_start, week_end },
            type: sequelize2.QueryTypes.SELECT,
        });

        const activities_name = activities.map((activity) => activity.activity_name);

        return res.status(200).send(activities_name);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};



exports.createWeeklyRatings = async(req, res)=>{
    try{
        if(!req.headers.authorization)
        return res.status(401).send("Missing Token headers authorization");

        const token = req.headers.authorization;
        const employee_id = verifyTokenAndGetId(token);

        if(!req.body)
        return res.status(400).send("Missing Request Body");
        console.log(req.body);

        const formData = req.body;
        const schema = Joi.object({
            busyness:           Joi.number().precision(2).required(),
            satisfaction:       Joi.number().precision(2).required(),
            core:               Joi.number().precision(2).required(),
            learning:           Joi.number().precision(2).required(),
            skill_acquired:     Joi.string().max(100).allow(null).optional(),
            ai_productivity:    Joi.number().precision(2).allow(null).optional(),
        })

        const {error} = schema.validate(formData);
        if(error){
         console.log(error);
        return res.status(400).send(error.details[0].message);
        }

        const year_week = parseInt(req.params.year_week);

        // create object for storing 
        const weeklyRatings={
            year_week:          year_week,
            employee_id:        employee_id,
            busyness:           formData.busyness,
            satisfaction:       formData.satisfaction,
            learning:           formData.learning,
            core:               formData.core,
            skill_acquired:     formData.skill_acquired,
            ai_productivity:    formData.ai_productivity
        }

        const newRating= await WeeklyRating.create(weeklyRatings).then(createdRating =>{
            console.log("Ratings created successfully");

        }).catch(error =>{

            if(error instanceof Sequelize.UniqueConstraintError){
            console.error('A unique constraint violation occured: ',error)
            return res.status(409).send({message: "Entries could not be inserted duplicate record", error:error.name});
            }
        })
        

        return res.status(200).send({message: "Weekly Ratings created successfully", newRating});

    }
    catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error\n"+ error);
    }
}



exports.createWeeklyReport = async (req,res) => {
    try{
        //  inputs : {activity: string,description: string, challenge: string, aiTool: string, status: string}[] = 
       // [{activity:"", description: "", challenge: "", aiTool: "", status: ""}]

        // 1. req body checks
         if(!req.headers.authorization)
         return res.status(401).send("Missing Token headers authorization");
        
         const token = req.headers.authorization;
         const employee_id = verifyTokenAndGetId(token);
         const year_week = parseInt(req.params.year_week);
         
         if(!req.params.year_week)
         return res.status(400).send("Missing Request Params");

         
         if(!req.body)
         return res.status(400).send("Missing Request Body");
         console.log(req.body);

         const formData = req.body;
        
         const schema = Joi.array().items(
            Joi.object({
            activity:       Joi.string().required(),
            description:    Joi.string().required(),
            challenge:      Joi.string().allow('').optional(),
            aiTool:         Joi.string().allow('').optional(),
            status:         Joi.string().required(),
         })
         );
``
        
        // 2. request body validation

        const {error} = schema.validate(formData);

        if(error){
        console.log(error);
        return res.status(400).send(error.details[0].message);
        }
        const currentDate = moment();
        //const year_week = parseInt(currentDate.format('YYYYWW'));

    
        // create array of object for weekly task

        const weekly_task_report =[];
        for(const item of formData){
            const week_task ={
                activity_id:            await fetchActivityId(item.activity),
                task_description:       item.description,
                year_week:              year_week,
                status:                 item.status,
                challenge_description:  item.challenge,
                employee_id:            employee_id,
                ai_tool:                item.aiTool
            }
            weekly_task_report.push(week_task);
        }
        
        console.log(weekly_task_report);

        // Check if array is not empty
        if (weekly_task_report && weekly_task_report.length > 0) {
            // Loop through the array and save each record individually
            for (const task of weekly_task_report) {
                if (!task.activity_id) {
                    console.log("Missing activity_id for task:", task);
                    throw new Error("Missing activity_id");
                }

                // Check if a record exists with the given combination
                const existingRecord = await WeeklyTaskReports.findOne({
                    where: {
                        year_week: task.year_week,
                        activity_id: task.activity_id,
                        employee_id: task.employee_id,
                        task_description: task.task_description
                        
                        // Include other fields if they are part of the unique criteria
                    }
                });
                if (existingRecord) {
                    // Update the existing record
                    await existingRecord.update(task);
                }else{
                await WeeklyTaskReports.create(task)
                    .catch((error) => {
                        console.log("Error in create: ", error);
                        throw new Error("Internal Server Error");
                    });
                }
            }
            return res.status(200).send("Weekly Report Created Successfully");
        } else {
            return res.status(400).send("No tasks to report");
        }

        // return res.status(200).send(weekly_task_report);
       
            // res.status(200).send("Weekly Report Created Successfully")
    }catch(error){
            console.log(error.details)
            console.log("error from main try catch ++++  "+ error );
            return res.status(500).send("Internal Server Error");
    }
    
}
exports.createWeeklyPlanReport = async (req,res) => {
    try{
         if(!req.headers.authorization)
         return res.status(401).send("Missing Token headers authorization");

         const token = req.headers.authorization;
         const employee_id = verifyTokenAndGetId(token);
         const year_week = parseInt(req.params.year_week);

         if(!req.params.year_week)
         return res.status(400).send("Missing Request Param");
         console.log(req.body);

         if(!req.body)
         return res.status(400).send("Missing Request Body");
         console.log(req.body);

         const formData = req.body;
        
         const schema = Joi.array().items(
            Joi.object({
            activity:       Joi.string().required(),
            description:    Joi.string().required(),
            status:         Joi.string().required(),
            due_date:      Joi.date().iso().required(),
         })
         );


        const {error} = schema.validate(formData);

        if(error){
        console.log(error);
        return res.status(400).send(error.details[0].message);
        }
        const currentDate = moment();
        //const year_week = parseInt(currentDate.format('YYYYWW'));

        const weekly_plan_report =[];
        for(const data of formData){
            const week_plan ={
                activity_id:            await fetchActivityId(data.activity),
                task_description:       data.description,
                year_week:              year_week,
                status:                 data.status,
                employee_id:            employee_id,
                due_date:               data.due_date,
            }
            weekly_plan_report.push(week_plan);
        }
        
        console.log(weekly_plan_report);

        // Check if array is not empty
        if (weekly_plan_report && weekly_plan_report.length > 0) {
            // Loop through the array and save each record individually
            for (const task of weekly_plan_report) {
                if (!task.activity_id) {
                    console.log("Missing activity_id for task:", task);
                    throw new Error("Missing activity_id");
                }

                 // Check if a record exists with the given combination
                    const existingRecord = await WeeklyPlanReports.findOne({
                        where: {
                            year_week: task.year_week,
                            activity_id: task.activity_id,
                            employee_id: task.employee_id,
                            task_description: task.task_description
                        }
                    });

                    if (existingRecord) {
                        // Update the existing record
                        await existingRecord.update(task);
                    } else {
                        // Create a new record
                        await WeeklyPlanReports.create(task)
                        .catch((error) => {
                            console.log("Error in create: ", error);
                            throw new Error("Internal Server Error");
                        });

                    }
              


            }
            return res.status(200).send("Weekly Plan Report Created Successfully");
        } else {
            return res.status(400).send("No tasks to report");
        }

        // return res.status(200).send(weekly_task_report);
       
            // res.status(200).send("Weekly Report Created Successfully")
    }catch(error){
            console.log(error.details)
            console.log("error from main try catch ++++  "+ error );
            return res.status(500).send("Internal Server Error");
    }
    
}

async function fetchActivityId(activity_name){
    try{
    const activity = await Activity.findOne({

        attributes:['activity_id'],
        where:{
            activity_name: activity_name
        }
    })
        console.log(activity.activity_id);
        return activity.activity_id;
    }
    catch(error){
        console.log(error)
        return res.status(402).send({message:"Activity id could not be found"});
    }

}

exports.fetchWeeklyReport = async(req, res) => {
    try{
        console.log(req.params);

        if(!req.headers.authorization)
        {return res.status(401).send({message:"Missing Token"})}

        if(!req.params)
        {return res.status(400).send({message: "Misssing Params"})}
        

        const token = req.headers.authorization;
        const employee_id= verifyTokenAndGetId(token);
        console.log(token);

        const year_week = parseInt(req.params.year_week )-1;
        console.log(year_week+" year_week");


        const ratings = await  WeeklyRating.findOne({
            attributes: ['busyness', 'satisfaction', 'learning', 'core', 'skill_acquired', 'ai_productivity'],
            where:{
                employee_id: employee_id,
                year_week: year_week
            }
        })
        const rating={
            busyness:           ratings.busyness,
            satisfaction:       ratings.satisfaction,
            learning:           ratings.learning,
            core:               ratings.core,
            skillAcquired:      ratings.skill_acquired,
            aiProductivity:     ratings.ai_productivity
        }

        //raksha
        const weekly_plans = await week_plan.findAll({
            attributes: ['task_description','status','due_date'],
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
                    due_date:       plan.due_date,
                    //challenge:      task.challenge_description,
                    //aiTool:         task.ai_tool
                }
                planObjects.push(planObject);
        });

        const weekly_tasks = await WeeklyTaskReports.findAll({
            attributes: ['task_description','status','challenge_description','ai_tool'],
            where:{
                employee_id: employee_id,
                year_week: year_week
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

        // console.log(JSON.stringify(taskObjects) + "  taskObjects(((((((((((((((((((((()))))))))))))))");


        console.log(ratings);
        console.log(weekly_plans);
        console.log(weekly_tasks);

        const week_task = JSON.stringify(taskObjects);

        return res.status(200).send({message:"OK",
                                     ratings: rating,
                                     plans:planObjects,
                                    tasks: taskObjects})

        

    }catch(error){
        console.log(error.details);
        return res.status(500).send({message:"An Internal Server Error"})
    }
}

exports.fetchWeeklyRatings = async(req,res) => {
    try{
        if(!req.headers.authorization)
        {return res.status(401).send({message:"Missing Token"})}

        if(!req.params)
        {return res.status(400).send({message: "Missing Params"})}

        const token = req.headers.authorization;
        const employee_id = verifyTokenAndGetId(token);

        

    }catch(error){
        return res.status(500).send({message:"An Internal Server Error"})
    }
}


exports.fetchWeeklyReportOld = async (req, res) => {
    try{
        if(!req.headers.authorization){
            res.status(401).json({message:"No token found"})
            return;
        }

        const empcode = verifyTokenAndGetId(req.headers.authorization);

        // get current date in the format YYYY-MM-DD
        const currentDate = moment().format('YYYY-MM-DD');
        //get current date -7 days in the format YYYY-MM-DD
        const lastWeekDate = moment().subtract(90, 'days').format('YYYY-MM-DD');


        // fetch all the activity from the daysActivities table for that employee for the last 7 days
        const activities = await DaysActivities.findAll({
            where:{
                employee:empcode,
                day:{
                    [Op.between]:[lastWeekDate,currentDate]
                }
            },
            attributes: ['activity','description', 'effort_placed']
        })

        const activityDescription = activities.map(activity => {
            return {
                activity:activity.activity,
                description:activity.description,
                effort_placed:activity.effort_placed
            }
        })
        console.log(activityDescription);

        // activityDescription take the common activity and concat the description in new line  and for the effort placed add the effort placed and convert it into hour
        const activityDescription2 = activityDescription.reduce((acc,curr) => {
            const found = acc.find(item => item.activity === curr.activity);
            if(found){
                found.description = found.description + "\n" + curr.description;
                found.effort_placed = (found.effort_placed + curr.effort_placed);
            }
            else{
                acc.push(curr);
            }
            return acc;
        },[])
        
        console.log(activityDescription2);

        // search the activity in activityDescription2 in the activity table and replace the activity id with the activity name in activityDescription2
        for(let i=0;i<activityDescription2.length;i++){
            const activity = await Activity.findOne({
                where:{
                    activity_id:activityDescription2[i].activity
                },
                attributes:['activity_name']
            })
            activityDescription2[i].activity = activity.activity_name;
        }
        console.log(activityDescription2);

        // divide  effort_placed by 60 and round it to 2 decimal places
        for(let i=0;i<activityDescription2.length;i++){
            activityDescription2[i].effort_placed = (activityDescription2[i].effort_placed/60).toFixed(2);
        }
        


       
        console.log(activityDescription2);



        
        return res.status(200).json({message:"Success",data:activityDescription2});

    
    }catch(err){
            
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
    }

    
}

exports.taskDescriptionDropdown = async (req, res) => {
    try{


        if(!req.headers.authorization)
        {return res.status(500).send({message: "Missing token"})}

        const token = req.headers.authorization;
        const employee_id = verifyTokenAndGetId(token);
        // const employee_id =7;

        const currentDate = moment();
        const year_week   = currentDate.format("YYYYWW");
        const yearWeekMoment = moment(currentDate, "YYYYWW");
        // console.log(`Year Week ===========================>${year_week}`);


        const t_week_start =  yearWeekMoment.startOf('week').toDate();
        const t_week_end =    yearWeekMoment.endOf('week').toDate();


        const startDate = moment(t_week_start).format("YYYY-MM-DD");
        const endDate   = moment(t_week_end).format("YYYY-MM-DD");
        console.log(`startDate: ${startDate}\n endDate: ${endDate}`)

        
      
        const lastWeekDate = moment().subtract(8, 'days').format('YYYY-MM-DD');

        const responseArray=[];
        
        const taskDesc = await DaysActivities.findAll({

            attributes:['activity','description'],
            where:{
                employee: employee_id,
                day: {
                    [Op.between]:[startDate, endDate]
                }

            }

        })

        taskDesc.forEach((row) => {

            const activity = row.activity;
            const description = row.description;

            console.log(`Activity: ${activity}, Description: ${description}`)

        });
        


        // now replace the activity id with the activity
        let i=1
        for(const item of taskDesc){
            console.log(`i: ${i}`);
            i++

            const activity = await Activity.findOne({
                attributes:['activity_name'],
                where:{
                    activity_id:    item.activity

                }
            })
             console.log(`i: ${i}`);
            const responseArrayElement ={
                activity_name:         activity.activity_name,
                task_description:      item.description
            }
            console.log(`responseArrayElement: ${JSON.stringify(responseArrayElement)} `);

            responseArray.push(responseArrayElement);
        }


            console.log(` \n\n\nresponseArray: ${JSON.stringify(responseArray)}`)

        console.log(currentDate.format("YYYYWW"));


        return res.status(200).send({message:"Ok", tasks: responseArray});
        
    }
    catch(error){
        console.log(error.details);
        return res.status(500).send({message: "Internal Server Error", });
    }
}




exports.fetchWeeklyActivitiesORIGINAL = async(req,res) => {
    
    try{
        // parse the token
        if(!req.headers.authorization){
            res.status(401).send('Missing Token');
        }

        // if(!req.body){
        //     res.status().send('Missing Request Body');
        // }

        if(!req.params){
            res.status(400).send("Missing Request Params");
        }


        const token = req.headers.authorization;
        const id = verifyTokenAndGetId(token)


        // Destructure the request body
        const {year_week} = req.params;

        const yearWeekMoment = moment(year_week, "YYYYWW");
        console.log(`Year Week ===========================>${year_week}`);


        const t_week_start =  yearWeekMoment.startOf('week').toDate();
        const t_week_end =    yearWeekMoment.endOf('week').toDate();

        console.log("t_week_start " + t_week_start);
        console.log("t_week_end " + t_week_end)
        
        const week_start    = moment(t_week_start).format( 'YYYY-MM-DD');
        const week_end      = moment(t_week_end).format('YYYY-MM-DD');

      // fetch the activities using  yearweek passed from the days_activities table. do not store the duplicate values , store unique activity (id) in the array.



        //  fetch the activity records.
        const days_activities = await DaysActivities.findAll({

            attributes: ['activity'],
            where: {

                employee: id,
                day:{
                    [Op.between]:[week_start, week_end]
                }
                // date lies between year week

            }
        })

        // console.log(days_activities.dataValues.activity);

        let activity_ids =  [];
        if (days_activities.length > 0) {
            // Loop through the results and log each activity
            days_activities.forEach(activityRecord => {

                activity_ids.push(activityRecord.activity);
                console.log("Activity: " + activityRecord.activity);
            });
        } else {
            console.log("No matching records found.");
        }

        console.log("activity_id array  " + activity_ids );
        // https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/

        activity_ids = [...new Set(activity_ids)];
        console.log("activity_id array duplicate removed "+ activity_ids)
        console.log("printing days_activities.activity  "+days_activities[0].activity);


        let activities_name =    [];
        for(i in activity_ids){
            const activity_name = await Activity.findOne({
                attributes: ['activity_name'],
                where:{
                    activity_id: activity_ids[i]
                }              
            })
            
            activities_name.push(activity_name.activity_name); 
        }

        activities_name = [...new Set(activities_name)];
        console.log(activities_name);


        // for(const activity_id of activity_ids){
        //    await  Activity.findOne({
        //         attributes: ['activity_name'],
        //         where:{
        //             activity_id: activity_id
        //         }
                
        //     }).then(activity =>{
        //         if(activity){
        //             activities_name.push(activity.activity_name);
        //         } else{
        //             activities_name.push(null);
        //         }
        //     }).catch(error =>{
        //         console.error("Error fetching activity:", error);
        //     })
           
        // }

        console.log("activities_name  "+ activities_name);

            // loop to push the acttivity id to to 
            // challenge how do is get the activities from the days_activities tab

            // fetch the corresponding activities for the arrays in the activity table and store them in an new array. Delete the id array.
            // send the activity array as the response.

            return res.status(200).send(activities_name);

    }
    catch(error){

        console.log(error);
        res.status(500).send('Internal server Error');
    }
    
}


exports.fetchWeeklyActivities = async (req, res) => {
    try {
      if (!req.headers.authorization) {
        res.status(401).send('Missing Token');
        return;
      }
  
      if (!req.params) {
        res.status(400).send("Missing Request Params");
        return;
      }
  
      const token = req.headers.authorization;
      const id = verifyTokenAndGetId(token);
  
      const { year_week } = req.params;
      const yearWeekMoment = moment(year_week, "YYYYWW");
      const t_week_start = yearWeekMoment.startOf('week').toDate();
      const t_week_end = yearWeekMoment.endOf('week').toDate();
      const week_start = moment(t_week_start).format('YYYY-MM-DD');
      const week_end = moment(t_week_end).format('YYYY-MM-DD');
  
      // Define a single SQL query to retrieve distinct activity names


      const query = `
        SELECT DISTINCT A.activity_name
        FROM activity A
        INNER JOIN days_activities DA ON A.activity_id = DA.activity
        WHERE DA.employee = :employee
        AND DA.day BETWEEN :week_start AND :week_end`;
  
      const results = await sequelize2.query(query, {
        replacements: { employee: id, week_start, week_end },
        type: sequelize2.QueryTypes.SELECT,
      });
      console.log('results of fetch weekly activities', results)
  
      const activities_name = results.map(result => result.activity_name);
  
      if (activities_name.length > 0) {
        res.status(200).send(activities_name);
      } else {
        // No results found
        res.status(200).send([]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server Error');
    }
  };


exports.fetchConcatenatedDescription = async(req,res) =>{
    try{
        const { year_week } = req.params;
        console.log()
        console.log("Test()()()()()()()()()()()()()()")
        if(!req.headers.authorization)
        {return res.status(401).send({message:"Missing Token"})}

        if(!req.params)
        {return res.status(400).send({message: "Misssing Params"})}
        
        const reqActivity = req.body.activity;
        console.log(reqActivity);

        const token = req.headers.authorization;
        const employee_id= verifyTokenAndGetId(token);

        const currentDate = moment();
        const currentDate2 = currentDate.format("YYYY-MM-DD");
        console.log(currentDate);

        // const activity = await Activity.findOne({
        //     where:{
        //         activity_name : reqActivity
        //     }
        // })
        const actquery = `SELECT * FROM activity WHERE activity_name = :activity_name LIMIT 1`
        
        const results = await sequelize2.query(actquery, {
            replacements: { activity_name: reqActivity },
            type: sequelize2.QueryTypes.SELECT,
          });
          console.log(`${JSON.stringify(results[0])} results[0]||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||`);

   
          const today = moment(); 
          // Get the current date
          const yearWeekMoment = moment(year_week, "YYYYWW");

          const startDate = yearWeekMoment.startOf('isoWeek').format('YYYY-MM-DD');
          const endDate   = yearWeekMoment.endOf('isoWeek').format('YYYY-MM-DD'); // Get the start of the current ISO week (Monday)

        console.log(`startDate ===> ${startDate}`);
        // console.log(`lastWeekDate => ${lastWeekDate}`)


        const descriptions = await DaysActivities.findAll({
            attributes: ['description'],
            where:{
                // activity: results.activity_id,
                activity:  results[0].activity_id,
                employee:  employee_id,
                day:{
                    [Op.between]:[startDate,endDate]
            }
        }
        })

       // Extract the 'description' values into a new array
const descriptionArray = descriptions.map(dayActivity => dayActivity.dataValues.description);

// Now, 'descriptionArray' contains an array of 'description' values


console.log(`Description Array ========================================= >>>>>>>> ${descriptionArray}`);  

       return res.status(200).send({message: "OK", task_description: descriptionArray});


          // fetch the descriptions for the activity using activity id and week start and week end for days

         

    }
    catch(error){
        console.log(error)
        return res.status(500).send({message:"Internal Server Error"})
    }
  }