const { getCurrentDate, verifyTokenAndGetId, transportMail } = require('./helpers');
const LoginLogs = require('../models/LoginLogs');
const Projects = require('../models/Projects')
const Activity   = require('../models/Activity');
const Departments = require('../models/departments');
const Employees = require('../models/Employees');
const holidays = require('../models/holiday');
const sequelize2 = require('../config/db');

// Holiday Management
exports.addHoliday = async (req, res) => {
    const { name, date } = req.body;
    try {

        const token = req.headers.authorization
        const empcode = verifyTokenAndGetId(token)
        if (!empcode) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const addHolidays= await holidays.create({ name, date }); 

        console.log("addHolidays::", addHolidays);        

        await LoginLogs.update(
            {
                holiday: 1,
            }, {
            where: {
                date: addHolidays.date
            }
        });
        res.status(201).json({ message: 'Holiday added successfully' });
    } catch (error) {
        let failedReason = {
            success: false,
            message: 'Error adding holiday',
            error: error.message
        }
        res.status(500).json(failedReason)
    }
};

exports.getHolidays = async (req, res) => {
    try {       
        const holidayList= await holidays.findAll({
            attributes: ['name', 'date'],
         });  
        res.status(200).json(holidayList);
    } catch (error) {
        let failedReason = {
            success: false,
            message: 'Error fetching holidays',
            error: error.message
        }
        res.status(500).json(failedReason)
    }
};

// Project Management
exports.addProject = async (req, res) => {
    console.log("req.body:", req.body);
    
    const { projectName } = req.body;
    console.log("projectName::", projectName);
    
    try {
        const token = req.headers.authorization
        const empcode = verifyTokenAndGetId(token);
        console.log("empcode:", empcode);
        
        if (!empcode) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const projects = await Projects.findOne({
            where: {
                proj_name: projectName.trim()
            }           
        })
        let newProject;

        if(!projects){
            newProject = await Projects.create({
                proj_name: projectName
            });
        }
        else{
            return res.status(201).json({ error: 'Project name already exist' })
        }

        res.status(200).json({ message: 'Project added successfully', newProject});
    } catch (error) {
        let failedReason = {
            success: false,
            message: 'Error adding project',
            error: error.message
        }
        res.status(500).json(failedReason)
    }
};

exports.getProjects = async (req, res) => {
    try {        
        const token = req.headers.authorization
        const empcode = verifyTokenAndGetId(token);
        console.log("empcode:", empcode);
        
        if (!empcode) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const projects = await Projects.findAll({
        })
        res.status(200).json({ message: 'Project fetch successfully', projects});
    } catch (error) {
        let failedReason = {
            success: false,
            message: 'Error fetching holidays',
            error: error.message
        }
        res.status(500).json(failedReason)
    }
};

exports.addActivity = async (req, res) => {
    const { activityName, description, useful, projId, } = req.body;
    console.log("projectName::", activityName);
    
    try {
        const token = req.headers.authorization
        const empcode = verifyTokenAndGetId(token);
        console.log("empcode:", empcode);
        
        if (!empcode) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const activity = await Activity.findOne({
            where: {
                activity_name: activityName.trim()
            }           
        })
        let newActivity;

        if(!activity){
            newActivity = await Activity.create({
                activity_name: activityName,
                proj_id: projId,
                useful: useful
            });
        }
        else{
            return res.status(401).json({ error: 'activity name already exist' })
        }

        res.status(201).json({ message: 'Activity added successfully', newActivity});
    } catch (error) {
        let failedReason = {
            success: false,
            message: 'Error adding Activity',
            error: error.message
        }
        res.status(500).json(failedReason)
    }
};

// HoD Management

exports.getDepartmentsWithHod = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const empcode = await verifyTokenAndGetId(token); // Ensure this is async
  
      if (!empcode) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      // Fetch all departments with their HOD details
      const departments = await sequelize2.query(`
        SELECT 
          d.dep_id AS department_id,
          d.department_name,
          e.id AS hod_id,
          e.first_name AS hod_firstname,
          e.last_name AS hod_lastname
        FROM 
          departments d
        LEFT JOIN 
          employees e ON d.hod_id = e.id
      `, { type: sequelize2.QueryTypes.SELECT });
  
      // Fetch all employees to allow the selection of a new HOD
      const employees = await sequelize2.query(`
        SELECT 
          id, 
          first_name,
          last_name 
        FROM 
          employees
      `, { type: sequelize2.QueryTypes.SELECT });
  
      // Send both departments and employees data to the frontend
      res.status(200).json({ departments, employees });
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'An error occurred while fetching department and HOD details.' });
    }
  };

  exports.createDepartment = async (req, res) => {
    const { departmentName, hodId } = req.body;
  
    if (!departmentName || !hodId) {
      return res.status(400).json({ success: false, message: 'Department name and HoD must be provided' });
    }
  
    try {
      const token = req.headers.authorization;
      const empcode = await verifyTokenAndGetId(token);
  
      if (!empcode) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      const newDepartment = await sequelize2.query(`
        INSERT INTO departments (department_name, hod_id)
        VALUES (:departmentName, :hodId)
      `, {
        replacements: { departmentName, hodId },
        type: sequelize2.QueryTypes.INSERT
      });
  
      res.status(201).json({ success: true, message: 'Department created successfully', newDepartment });
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({ success: false, message: 'Error creating department', error: error.message });
    }
  };  
  
  exports.updateHod = async (req, res) => {


    const { departmentName, depID, newHod } = req.body;
    console.log("req.body:", req.body);    
    if (!departmentName || !newHod) {
      return res.status(400).json({ success: false, message: 'Department and new HOD must be provided' });
    }
  
    try {
      const token = req.headers.authorization;
      const empcode = await verifyTokenAndGetId(token);
  
      if (!empcode) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      const hodUpdate = await sequelize2.query(`
        UPDATE departments
        SET department_name = :departmentName, hod_id = :newHod
        WHERE dep_id = :depID
      `, {
        replacements: { departmentName, newHod, depID },
        type: sequelize2.QueryTypes.UPDATE
      });
  
      res.status(200).json({ success: true, message: 'HoD updated successfully', hodUpdate });
    } catch (error) {
      console.error('Error updating HOD:', error);
      res.status(500).json({ success: false, message: 'Error updating HOD', error: error.message });
    }
  };

  // DELETE API to remove HoD
exports.deleteDepartment = async (req, res) => {
    const { departmentId } = req.params;
  
    const dep_id = parseInt(departmentId, 10);  

    try {
      const [result, metadata] = await sequelize2.query(
        `DELETE FROM departments WHERE dep_id = :dep_id`,
        {
          replacements: { dep_id },
        }
      );
    
      console.log("Rows affected:", metadata.affectedRows);    
  
      if (result) {
        res.json({
          success: true,
          message: "Department deleted successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Failed to delete department",
        });
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(500).json({
        success: false,
        message: "Error occurred while deleting department",
        error: error.message,
      });
    } 
}
  

