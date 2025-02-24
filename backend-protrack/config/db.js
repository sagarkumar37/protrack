const { Sequelize } = require('sequelize');
require('dotenv').config();


// const sequelize = new Sequelize('protrack', 'root', 's', {
// host: 'localhost',
//  port: 3306,
// dialect: 'mysql',
// paranoid: true
// });

const sequelize = new Sequelize('protrack', 'root', 'mysqlDB#1122', {
    host: 'localhost',
     port: 3306,
    dialect: 'mysql',
    paranoid: true
});

// const sequelize = new Sequelize('protrack', 'root', 'Pass#123', {
//     host: '127.0.0.1',
//      port: 3306,
//     dialect: 'mysql',
//     paranoid: true
//     });
    

// const sequelize = new Sequelize('protrack', 'root', 'spike@321', {
//     host: 'localhost',
//      port: 3306,
//     dialect: 'mysql',
//     paranoid: true
// });





module.exports = sequelize;



