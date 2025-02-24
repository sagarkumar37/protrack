const sequelize = require('../../config/db');


exports.getProjects = async(req,res) =>{
    try {
        const [results] = await sequelize.query(`
          SELECT proj_id, proj_name 
          FROM projects
        `);
        res.json(results);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}