const  Sequelize = require('sequelize');
const sequelize2 = require('../config/db');
const Employees = require('./Employees');

const Departments = sequelize2.define('departments', {
  department_name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  dep_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  dep_desc: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  hod_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  }
}, {
  tableName: 'departments',
  timestamps: false
});

module.exports = Departments;