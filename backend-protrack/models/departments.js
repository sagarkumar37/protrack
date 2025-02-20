const  Sequelize = require('sequelize');
const sequelize2 = require('../config/db');

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
  hod: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'employee_code'
    }
  }
}, {
  timestamps: false
});

module.exports = Departments;
