const { Sequelize, DataTypes } = require("sequelize");
const sequelize2 = require("../config/db");

const assignedLeave = sequelize2.define("assigned_leave", {
  assigned_leave_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees', // Reference the employees table
      key: 'id',
    },
  },
  leave_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'leave_type', // Reference the leave_type table
      key: 'leave_type_id',
    },
  },
  max_leaves: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Default value for max leaves
  },
}, {
  timestamps: false,
  tableName: "assigned_leave", // Explicitly set table name
});

module.exports = assignedLeave;