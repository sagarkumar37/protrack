const sequelize = require('../../config/db');


exports.getEmployees = async(req , res, next) =>{
    try {
        const [results] = await sequelize.query(`
          SELECT 
            id, 
            CONCAT(first_name, ' ', last_name) AS name 
          FROM employees 
          WHERE enabled = b'1'
        `);
        res.json(results);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}