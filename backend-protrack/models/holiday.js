const {Sequelize, DataTypes} = require('sequelize');
const sequelize2 = require('../config/db');

const holidays = sequelize2.define('holiday_mst', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }},
  {
    tableName: 'holiday_mst',
    timestamps: false
  })

module.exports = holidays;

