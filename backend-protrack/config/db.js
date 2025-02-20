const { Sequelize } = require('sequelize');
require('dotenv').config();



const sequelize = new Sequelize('protrack', 'root', 'mysqlDB#1122', {
host: '172.17.0.3',
 port: 3306,
dialect: 'mysql',
paranoid: true
});

 
module.exports = sequelize;



