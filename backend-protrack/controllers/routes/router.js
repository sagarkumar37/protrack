const express = require('express');
const router = express.Router();
const {login }= require('../controllers/controllers');
const controllers = require('../controllers/controllers');
const workReport  = require('../controllers/work_report');
const adminReport = require('../controllers/admin_work_report');
const weeklyplan = require('../controllers/weekly_plan_raksha');
const employee_logs= require('../controllers/employee_logs');
// self code

router.post('/login', login);
router.post('/daysactivity', controllers.createDaysActivity);
router.post('/logs',controllers.createLoginLogs)
router.get('/api/dropdown_options2', controllers.dropdownController);
router.get('/timesheetflag', controllers.timesheetFlag);
router.get('/report/:days', controllers.employeeReport);
router.get('/fetchempname',controllers.fetchEmployeeName);
router.get('/fetchempcode',controllers.fetchEmployeeCode);
router.post('/punchinTime2', controllers.punchIn);
router.post('/punchoutTime2', controllers.punchOut);
router.get('/timeEntries',controllers.generateTimeEntries);
router.get('/api/hours',controllers.apiHours);
router.get('/api/minutes',controllers.apiMinutes);

router.get('/fetchpunchinout',controllers.fetchPunchInOut); 

router.get('/duration/:days',controllers.getTotalTime);

router.get('/productivetime/:days',controllers.getProductiveTime);

router.get('/unproductivetime/:days', controllers.getUnproductiveTime);

router.get('/idleminutes/:days',controllers.getIdleTime);

router.get('/learningtime/:days', controllers.getLearningTime);

router.get('/breaktime/:days', controllers.getBreakTime);

router.post('/createloginlogs',controllers.createLoginLogs);

router.get('/fetchplans',weeklyplan.FetchPlans);

router.put('/updateplans',weeklyplan.UpdatePlans);

router
router.get('/fetchWeeklyActivities/:year_week',workReport.fetchWeeklyActivities);

router.post('/createWeeklyRating/:year_week',workReport.createWeeklyRatings);

router.post('/createWeeklyTaskReport/:year_week',workReport.createWeeklyReport);

router.get('/fetchPreviousWeekDetails/:year_week',workReport.fetchWeeklyReport);


router.get('/checkEmployeeRole',adminReport.checkEmployeeRole);



// router.get('/fetchTasks',workReport.fetchActivities, controllers.dropdownController);

// router.get('/testmodels/:param', workReport.testModels);

// router.get('/fetchActivities', workReport.fetchActivities);

router.get('/fetchWeeklyReport', workReport.fetchWeeklyReportOld);

router.get('/fetchTaskDescription',workReport.taskDescriptionDropdown)

router.post('/fetchDescription/:year_week', workReport.fetchConcatenatedDescription);

router.get('/fetchEmployees', adminReport.fetchEmployees);

// router.post('/adminfetchPreviousWeekDetails',adminReport.adminfetchWeeklyReport)
router.get('/employeelogs/:date',employee_logs.timelogs);
router.post('/adminfetchPreviousWeekDetails',adminReport.masterWeekReport);

router.post('/fetchSingleEmployeeReport',adminReport.employeeWeekReport);

router.get('/weeksDropdown/:params',workReport.weeksDropdown);

// self code





// router.post('/loginlogs',createLoginLogs)

// router.get('/unproductivetime/:days', controllers.getUnproductiveTime);

// router.get('/productivetime/:days', controllers.getProductiveTime);

// router.get('/learningtime/:days', controllers.getLearningTime);

router.post('/CreateWeeklyPlan/:year_week',workReport.createWeeklyPlanReport);

// router.post('/',);
// router.get('/', );

module.exports = router;

