const { Sequelize, DataTypes } = require("sequelize");
const sequelize2 = require("../config/db");

const leaveType = sequelize2.define(
  "leave_type",
  {
    leave_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    leave_type_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure leave type names are unique
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "leave_type", // Explicitly set table name
  }
);

module.exports = leaveType;
