const { getCurrentDate, verifyTokenAndGetId, transportMail } = require('./helpers');
const LoginLogs = require('../models/LoginLogs');
const Projects = require('../models/Projects')
const Activity   = require('../models/Activity');
const Departments = require('../models/departments');
const Employees = require('../models/Employees');
const holidays = require('../models/holiday');
const Customers= require('../models/Customers');
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
  const { projectName, billingType, nonBillableType, customerCode, description } = req.body;

  try {
    const token = req.headers.authorization;
    const empcode = verifyTokenAndGetId(token);
    if (!empcode) return res.status(401).json({ error: "Invalid token" });

    // check project already exists
    const existing = await Projects.findOne({ where: { proj_name: projectName.trim() } });
    if (existing) {
      return res.status(400).json({ error: "Project name already exists" });
    }

    const newProject = await Projects.create({
      proj_name: projectName,
      proj_desc: description,
      billable: billingType === "billable",
      capitalizable: billingType === "non-billable" ? true : false,
      non_billable_type: billingType === "non-billable" ? nonBillableType : null,
      customer_code: customerCode || null
    });

    return res.status(200).json({ message: "Project added successfully", newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding project", error: error.message });
  }
};


exports.updateProject = async (req, res) => {
  const { projectId, billingType, nonBillableType, customerCode } = req.body;

  try {
    const token = req.headers.authorization;
    const empcode = verifyTokenAndGetId(token);
    if (!empcode) return res.status(401).json({ error: "Invalid token" });

    let project = await Projects.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.update({
      billable: billingType === "billable",
      capitalizable: billingType === "non-billable" ? true : false,
      non_billable_type: billingType === "non-billable" ? nonBillableType : null,
      customer_code: customerCode || null
    });

    return res.status(200).json({ message: "Project updated successfully", updatedProject: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating project", error: error.message });
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
            message: 'Error fetching Project',
            error: error.message
        }
        res.status(500).json(failedReason)
    }
};

exports.addActivity = async (req, res) => {
    const { activity_name, activity_type, description, useful, proj_id, } = req.body;
    console.log("projectName::", activity_name);
    
    try {
        const token = req.headers.authorization
        const empcode = verifyTokenAndGetId(token);
        console.log("empcode:", empcode);
        
        if (!empcode) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const activity = await Activity.findOne({
            where: {
                activity_name: activity_name.trim()
            }           
        })
        let newActivity;

        if(!activity){
            newActivity = await Activity.create({
                activity_name,
                proj_id,
                useful,
                activity_type
            });
        }
        else{
            return res.status(201).json({ error: 'activity name already exist' })
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

exports.getAllActivitiesWithTypes = async (req, res) => {
  try {
    const token = req.headers.authorization
    const empcode = verifyTokenAndGetId(token);
    console.log("empcode:", empcode);
    
    if (!empcode) {
        return res.status(401).json({ error: 'Invalid token' })
    }
    const [results] = await sequelize2.query(`
      SELECT a.id, a.name, t.type_name 
      FROM activity_masters a
      JOIN activity_types t ON a.type_id = t.id
      ORDER BY a.name
    `);
    res.status(200).json({ message: 'Activities with types fetch successfully', results});
  } catch (error) {
    console.error('Error fetching activities with types:', error);
    let failedReason = {
      success: false,
      message: 'Error fetching activities with types',
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

exports.getCustomers= async (req, res) => {
  try{

    const token = req.headers.authorization
    const empcode = verifyTokenAndGetId(token);
    console.log("empcode:", empcode);
    
    if (!empcode) {
        return res.status(401).json({ error: 'Invalid token' })
    }

    const customers= await Customers.findAll()
    console.log("customers::", customers)
    if(customers){
      res.status(200).json(customers);
    }else{
      let failedReason = {
      success: false,
      message: 'Error fetching customers',
      error: error.message
      }
      res.status(500).json(failedReason)
    }


  }catch(error){
    let failedReason = {
        success: false,
        message: 'Error fetching customers',
        error: error.message
    }
    res.status(500).json(failedReason)
  }
  
}

exports.addCustomer = async (req, res) => {
  try {
    const { customer_name, customer_code } = req.body;

    if (!customer_name || !customer_code) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCustomer = await Customers.create({
      customer_name,
      customer_code
    });

    res.status(201).json(newCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create customer" });
  }
}
  

