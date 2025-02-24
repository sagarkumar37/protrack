const { Sequelize, DataTypes } = require("sequelize");
const sequelize2 = require("../config/db");
const leaveType = require("./leaveType"); // Import leaveType model

const leaveRequest = sequelize2.define(
  "leave_requests",
  {
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employees", // Reference the employees table
        key: "id",
      },
    },
    from_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    leave_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "leave_type", // Reference the leave_type table
        key: "leave_type_id",
      },
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending", // Possible values: Pending, Approved, Rejected
    },
    hod_comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    added_by_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // True if leave was added by admin
    },
    req_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    hod_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "employees", // Reference the employees table (HOD is also an employee)
        key: "id",
      },
    },
    hod_email: {
      type: DataTypes.STRING, // Changed to STRING (email is a string, not INTEGER)
      allowNull: true,
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emp_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "leave_requests",
  }
);

leaveRequest.belongsTo(leaveType, {
  foreignKey: "leave_type_id", // Foreign key in leave_requests
  as: "leaveType", // Alias for the association
});

leaveType.hasMany(leaveRequest, {
  foreignKey: "leave_type_id", // Foreign key in leave_requests
  as: "leaveRequests",
});

module.exports = leaveRequest;
