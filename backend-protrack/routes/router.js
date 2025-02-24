const express = require('express');
const router = express.Router();
const {login }= require('../controllers/controllers');
const controllers = require('../controllers/controllers');
const adminController = require('../controllers/adminController');
const workReport  = require('../controllers/work_report');
const adminReport = require('../controllers/admin_work_report');
const weeklyplan = require('../controllers/weekly_plan_raksha');
const leaveController = require('../controllers/leave-management');
// self code

router.get('/employees', controllers.getAllEmployees);

router.post('/login', login);
router.post('/auth/validate-token', controllers.ValidateToken)
router.post('/daysactivity', controllers.createDaysActivity);
router.post('/daysactivityv2', controllers.createDaysActivityV2);
router.post('/getTimeSheetAtDate', controllers.getTimeSheetAtDate);
router.post('/logs',controllers.createLoginLogs)
router.post('/attendanceDetails', controllers.getLoginLogsDeatils)
router.post('/attendanceRegularizationRequest', controllers.attendanceRegularizationInsert)
router.post('/updateAttendanceRegularizationRequest', controllers.updateAttendanceRegularizationInsert)
router.get('/checkRegularizationRequestValid', controllers.isApprovedAttendance)
router.get('/getAttendanceRegularizationRequest', controllers.getAttendanceRegularizationReq)

//admin management
router.post('/addHoliday', adminController.addHoliday);
router.get('/getHoliday', adminController.getHolidays);

router.post('/addProject', adminController.addProject);
router.get('/getProject', adminController.getProjects);

router.post('/addActivity', adminController.addActivity);

router.get('/departments', adminController.getDepartmentsWithHod);
router.post('/createDepartment', adminController.createDepartment);
router.put('/updateHod', adminController.updateHod);

router.delete('/api/hod/:departmentId', adminController.deleteDepartment)
// End admin management

//Leave Routing
router.post("/empApplyLeave", leaveController.applyLeaveByEmp)
router.patch("/hodApproveLeave/:id", leaveController.hodApproveLeave)
router.post("/adminAddLeave", leaveController.adminAddLeaveForEmp);
router.get("/leaves", leaveController.getRequestedLeave);
router.delete("/deleteLeave/:id", leaveController.deleteRequestedLeave);
router.get('/leave/:req_id', leaveController.getLeaveById);
router.get('/leave-requests', leaveController.getLeaveRequests)
router.get('/leave-types-and-balance/:employee_id', leaveController.getLeaveTypesAndBalance)
router.post("/assigned-max-leave", leaveController.assignedMaxLeaveForEmp)
router.get('/leave-types', leaveController.getLeaveTypes)
// End Leave Routing
    
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

router.get('/effort/:days',controllers.getTotalEffortTime);

router.get('/productivetime/:days',controllers.getProductiveTime);

router.get('/unproductivetime/:days', controllers.getUnproductiveTime);

router.get('/idleminutes/:days',controllers.getIdleTime);

router.get('/learningtime/:days', controllers.getLearningTime);

router.get('/breaktime/:days', controllers.getBreakTime);

router.post('/createloginlogs',controllers.createLoginLogs);

router.get('/fetchplans',weeklyplan.FetchPlans);

router.put('/updateplans',weeklyplan.UpdatePlans);


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

// timesheet report routes

const getEmployees = require('../controllers/timesheetreport/getemployees');
router.get('/api/employees', getEmployees.getEmployees);

const getProjects = require('../controllers/timesheetreport/getprojects');
router.get('/api/projects', getProjects.getProjects);


const getActivityTypes = require('../controllers/timesheetreport/getactivitytypes');
router.get('/api/activity-types', getActivityTypes.getActivityTypes);


const timesheetReport = require('../controllers/timesheetreport/timesheetReport');
const validateTimesheetReport = require('../controllers/timesheetreport/validateTimesheetReport');
router.post('/api/timesheet-report',validateTimesheetReport.validateTimesheetReport, timesheetReport.timesheetReport);




module.exports = router;



