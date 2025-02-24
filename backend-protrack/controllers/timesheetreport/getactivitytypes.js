const sequelize = require('../../config/db');

exports.getActivityTypes = async(req,res) =>{
    try {
        const [results] = await sequelize.query(`
          SELECT DISTINCT activity_type 
          FROM activity 
          WHERE activity_type IS NOT NULL
        `);
        res.json(results);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}