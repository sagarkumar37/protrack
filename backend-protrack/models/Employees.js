const Sequelize = require('sequelize');
const sequelize2 = require('../config/db');
const Employees = sequelize2.define('employees', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  email_id: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(50),
    allowNull: true
  },
  department: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'departments',
      key: 'dep_id'
    }
  },
  first_name: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  middle_name: {
    type: Sequelize.STRING(20),
    allowNull: true
  },
  last_name: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  username: {
    type: Sequelize.STRING(50),
    allowNull: true
  },
  role: {
    type: Sequelize.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'employees',
  timestamps: false
});

module.exports = Employees;
