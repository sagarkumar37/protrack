// const sequelize2 = require('../config/db');
// const Employees  = require('../models/Employees');
// const Activity   = require('../models/Activity');
// const LoginLogs  = require('../models/LoginLogs');
// const Projects   = require('../models/Projects');
// const moment     = require('moment')
// const { getCurrentDate, verifyTokenAndGetId } = require('./helpers');
// const jwt = require('jsonwebtoken');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// // Import the models from the work-report folder

// const DaysActivities = require('../models/DaysActivities');


// // Write a controller function to test the models of the work report
// exports.testModels = async (req, res) => {

//     try {
//          // extract the param from the apiurl
//     const { param } = req.params;
//     let response;

//         // if(param === "weekmst"){
//         // response = await WeekMst.findAll();
//         // }

//         // if(param === "employee-weekmst"){
//         //     response = await EmployeeWeekMst.findAll();
//         // }

//         // if(param === "activity-employee-weekmst"){
//         //     response = await ActivityEmployeeWeekMst.findAll();
//         // }

//         // send response
//         res.status(200).json({ message: "Success", data: response });
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }


// }

// // exports.fetchActivities = async (req, res) => {

        
// //         try{
// //             if(!req.headers.authorization){
// //                 res.status(401).json({message:"No token found"})
// //                 return;
// //             }
// //             const token = req.headers.authorization;
// //             const  employee  = verifyTokenAndGetId(token);
// //             const 
// //             {
// //                 year_week
// //             }           = req.body;

// //             // check the value of status

// //             // 
// //             const yearWeekmoment = moment(yearweek, 'YYYYWW');
    
// //             // send error message
// //          let   week_start_date;
// //          let   week_end_date;

// //             const activities = await DaysActivities.findAll({
// //                 where:{
// //                     employee:employee,
// //                     day:{
// //                         [Op.between]:[week_start_date,week_end_date]
// //                     }              
// //                      }

// //             })

// //             console.log(activities);
// //             return res.send(activities);
// //             res.status(400).json({message:"Invalid status"})
        
        
        
// //     }catch(err){

// //             console.log(err)
// //             res.status(500).json({ message: "Internal Server Error" });
// //         }

// // }


// exports.fetchWeeklyActivities = async(req,res) => {

//     try{
//         // parse the token
//         if(!req.headers.authorization){
//             res.status().send('Missing Token');
//         }

//         if(!req.body){
//             res.status().send('Missing Request Body');
//         }


//         const token = req.headers.authorization;
//         const id = verifyTokenAndGetId(token)



//         // Destructure the request body
//         const {year_week} = req.body;

//         const yearWeekMoment = moment(year_week, "YYYYWW");

        

//         const t_week_start =  yearWeekMoment.startOf('week').toDate();
//         const t_week_end =    yearWeekMoment.endOf('week').toDate();

//         console.log("t_week_start " + t_week_start);
//         console.log("t_week_end " + t_week_end)
        
//         const week_start    = moment(t_week_start).format( 'YYYY-MM-DD');
//         const week_end      = moment(t_week_end).format('YYYY-MM-DD');





//       // fetch the activities using  yearweek passed from the days_activities table. do not store the duplicate values , store unique activity (id) in the array.



//         //  fetch the activity records.
//         const days_activities = await DaysActivities.findAll({

//             attributes: ['activity'],
//             where: {

//                 employee: id,
//                 day:{
//                     [Op.between]:[week_start, week_end]
//                 }
//                 // date lies between year week

//             }
//         })

//         // console.log(days_activities.dataValues.activity);

//         let activity_ids =  [];
//         if (days_activities.length > 0) {
//             // Loop through the results and log each activity
//             days_activities.forEach(activityRecord => {

//                 activity_ids.push(activityRecord.activity);
//                 console.log("Activity: " + activityRecord.activity);
//             });
//         } else {
//             console.log("No matching records found.");
//         }

//         console.log("activity_id array  " + activity_ids );
//         // https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/

//         activity_ids = [...new Set(activity_ids)];
//         console.log("activity_id array duplicate removed "+ activity_ids)
//         console.log("printing days_activities.activity  "+days_activities[0].activity);


//         let activities_name =    [];
//         for(i in activity_ids){
//             const activity_name = await Activity.findOne({
//                 attributes: ['activity_name'],
//                 where:{
//                     activity_id: activity_ids[i]
//                 }              
//             })
            
//             activities_name.push(activity_name.activity_name); 
//         }

//         activities_name = [...new Set(activities_name)];
//         console.log(activities_name);


//         // for(const activity_id of activity_ids){
//         //    await  Activity.findOne({
//         //         attributes: ['activity_name'],
//         //         where:{
//         //             activity_id: activity_id
//         //         }
                
//         //     }).then(activity =>{
//         //         if(activity){
//         //             activities_name.push(activity.activity_name);
//         //         } else{
//         //             activities_name.push(null);
//         //         }
//         //     }).catch(error =>{
//         //         console.error("Error fetching activity:", error);
//         //     })
           
//         // }





//         console.log("activities_name  "+ activities_name);


    

//                 // loop to push the acttivity id to to 
        
       
     



                



//             // challenge how do is get the activities from the days_activities tab

//             // fetch the corresponding activities for the arrays in the activity table and store them in an new array. Delete the id array.
//             // send the activity array as the response.

//             return res.status(200).send(activities_name);

//     }
//     catch(error){

//         console.log(error);
//         res.status(500).send('Internal server Error');
//     }
    
// }




// // exports.createWeeklyReport = async (req, res) => {
// // }
// exports.fetchWeeklyReportOld = async (req, res) => {
//     try{
//         if(!req.headers.authorization){
//             res.status(401).json({message:"No token found"})
//             return;
//         }

//         const empcode = verifyTokenAndGetId(req.headers.authorization);

//         // get current date in the format YYYY-MM-DD
//         const currentDate = moment().format('YYYY-MM-DD');
//         //get current date -7 days in the format YYYY-MM-DD
//         const lastWeekDate = moment().subtract(7, 'days').format('YYYY-MM-DD');


//         // fetch all the activity from the daysActivities table for that employee for the last 7 days
//         const activities = await DaysActivities.findAll({
//             where:{
//                 employee:empcode,
//                 day:{
//                     [Op.between]:[lastWeekDate,currentDate]
//                 }
//             },
//             attributes: ['activity','description', 'effort_placed']
//         })

    


//         const activityDescription = activities.map(activity => {
//             return {
//                 activity:activity.activity,
//                 description:activity.description,
//                 effort_placed:activity.effort_placed
//             }
//         })
//         console.log(activityDescription);

//         // activityDescription take the common activity and concat the description in new line  and for the effort placed add the effort placed and convert it into hour
//         const activityDescription2 = activityDescription.reduce((acc,curr) => {
//             const found = acc.find(item => item.activity === curr.activity);
//             if(found){
//                 found.description = found.description + "\n" + curr.description;
//                 found.effort_placed = (found.effort_placed + curr.effort_placed);
//             }
//             else{
//                 acc.push(curr);
//             }
//             return acc;
//         },[])
        
//         console.log(activityDescription2);

//         // search the activity in activityDescription2 in the activity table and replace the activity id with the activity name in activityDescription2
//         for(let i=0;i<activityDescription2.length;i++){
//             const activity = await Activity.findOne({
//                 where:{
//                     activity_id:activityDescription2[i].activity
//                 },
//                 attributes:['activity_name']
//             })
//             activityDescription2[i].activity = activity.activity_name;
//         }
//         console.log(activityDescription2);

//         // divide  effort_placed by 60 and round it to 2 decimal places
//         for(let i=0;i<activityDescription2.length;i++){
//             activityDescription2[i].effort_placed = (activityDescription2[i].effort_placed/60).toFixed(2);
//         }
        


       
//         console.log(activityDescription2);



        
//         return res.status(200).json({message:"Success",data:activityDescription2});

    
//     }catch(err){
            
//             console.log(err)
//             res.status(500).json({ message: "Internal Server Error" });
//     }

    
// }