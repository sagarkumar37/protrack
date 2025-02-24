const { Sequelize, DataTypes } = require('sequelize');
const sequelize2 = require('../config/db');

const Projects = sequelize2.define('projects', {
    proj_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    proj_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    proj_desc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    billable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    capitalizable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    accountable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    contact_person: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'employees',
      //   key: 'id'
      // },
    }
  }, {
    tableName: 'projects',
    timestamps: false
  })
  

module.exports = Projects;







