const {Sequelize, DataTypes} = require("sequelize");
const sequelize2 = require("../config/db");

const attendance_regularization = sequelize2.define('attendance_regularization', {
  start_time: {
    type: Sequelize.TIME,
    allowNull: false
  },
  end_time: {
    type: Sequelize.TIME,
    allowNull: false
  },
  hours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weekend: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  on_leave: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  holiday: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  request_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  employeecode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  req_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  hod_feedback: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  hod_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hod_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  emp_email: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'attendance_regularization',
  timestamps: false
});

module.exports = attendance_regularization;
