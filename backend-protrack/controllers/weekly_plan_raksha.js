const sequelize2 = require('../config/db');
const Employees  = require('../models/Employees');
const moment     = require('moment');
const { getCurrentDate, verifyTokenAndGetId } = require('./helpers');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const week_plan = require('../models/work-report/week_plan');
const WeeklyTaskReports = require('../models/work-report/WeeklyTaskReports');

const Activity = require('../models/Activity'); // Import the Projects model

exports.FetchPlans = async (req, res) => {
  try {
    if (!req.headers.authorization) return res.status(401).send("Missing Token headers authorization");

    const token = req.headers.authorization;
    const employee_id = verifyTokenAndGetId(token);

    if (!req.body) return res.status(400).send("Missing Request Body");

    const incompleteTasks = await week_plan.findAll({
      where: {
        status: 'Planned',
        employee_id: employee_id,
      },
      include: [
        {
          model: Activity,
          as: 'activity', // alias for the join
          attributes: ['activity_name'], // select only proj_name from Projects
        },
      ],
    });

    // Map the result to include activity_name instead of activity_id
    const result = incompleteTasks.map(task => ({
      id: task.id,
      activity_name: task.activity.activity_name,
      year_week: task.year_week,
      employee_id: task.employee_id,
      task_description: task.task_description,
      status: task.status,
      due_date: task.due_date,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



exports.UpdatePlans=async(req,res)=>{
  try{
      if(!req.headers.authorization)
  return res.status(401).send("Missing Token headers authorization");

      const token = req.headers.authorization;
      const employee_id = verifyTokenAndGetId(token);

      if(!req.body)
      return res.status(400).send("Missing Request Body");
      console.log(req.body);

    const { planIds, status } = req.body;

  // Validate if the status is valid (you can add more validation as needed)
  if (status !== 'Complete' && status !== 'Planned') {
    return res.status(400).json({ error: 'Invalid status provided' });
  }

  // Update the status for multiple plans in the database
  const [numberOfAffectedRows, updatedPlans] = await week_plan.update(
    { status },
    {
      where: {
          id: { [Sequelize.Op.in]: planIds },
      },
      returning: true, // Get the updated plans
    }
  );

  if (numberOfAffectedRows === 0) {
    return res.status(404).json({ error: 'No plans found' });
  }
  const plansArray = Array.isArray(updatedPlans) ? updatedPlans : [updatedPlans];
  const completedTasks = plansArray
      .filter((plan) => plan.status === 'Complete') // Filter completed plans
      .map((plan) => {
        return {
          activity_id: plan.activity_id,
          year_week: plan.year_week, // Assuming year_week is available in the week_plan model
          employee_id: plan.employee_id,
          task_description: plan.task_description,
          status: plan.status,
          challenge_description: null,
          ai_tool:null,
        };
      });
      console.log("Completed Tasks:", completedTasks);
    if (completedTasks.length > 0) {
      await WeeklyTaskReports.bulkCreate(completedTasks);
    }
  
  res.json(updatedPlans); // Send the updated plans as the response
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
}


