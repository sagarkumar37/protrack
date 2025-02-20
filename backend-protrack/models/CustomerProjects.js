const { Sequelize, DataTypes } = require('sequelize');
const sequelize2 = require('../config/db');

const CustomerProject = sequelize2.define('customer_project', {
  customer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'customer',
      key: 'customer_id'
    }
  },
  project_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'project',
      key: 'proj_id'
    }
  }
}, {
  tableName: 'customer_projects',
  timestamps: false
});

module.exports = CustomerProject;
