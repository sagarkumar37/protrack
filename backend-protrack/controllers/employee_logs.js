const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment     = require('moment');
const sequelize2 = require('../config/db');
const emp_logs= require('../models/LoginLogs');
const Employees = require('../models/Employees');
exports.timelogs = async (req, res) => {
    try {
        const date = req.params.date;
    
        const loginLogs = await emp_logs.findAll({
          where: {
            date: date,
          },
          include: [
            {
              model: Employees,
              as: 'empcode',
              attributes: ['first_name', 'last_name', [Sequelize.fn('concat', Sequelize.col('empcode.first_name'), ' ', Sequelize.col('empcode.last_name')), 'full_name']],
              
              
              where: {
                id: Sequelize.col('loginlogs.employeecode'),
              },
            },
          ],
          attributes: ['start_time', 'end_time','hours'],
        });
    
        res.json(loginLogs);
        console.log(loginLogs);
      } catch (error) {
        console.error('Error retrieving login logs: ' + error.message);
        res.status(500).send('Error retrieving data');
      }
}
