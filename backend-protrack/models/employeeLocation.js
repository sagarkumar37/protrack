const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmployeeLocation = sequelize.define('employee_locations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employee',
      key: 'id'
    }
  },
  event_type: {
    type: DataTypes.ENUM('punch_in', 'punch_out'),
    allowNull: false
  },
  event_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  accuracy: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  location_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'employee_locations',
  timestamps: true,
  createdAt: 'recorded_at',
  updatedAt: false
});

module.exports = EmployeeLocation;