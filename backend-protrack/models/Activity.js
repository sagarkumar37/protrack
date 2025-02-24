// chatgpt
const Sequelize = require("sequelize");
const sequelize2 = require("../config/db");

const Activity = sequelize2.define('activity', {
  activity_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  proj_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'projects',
      key: 'proj_id'
    }
  },
  activity_type: {
    type: Sequelize.STRING,
    allowNull: true
  },
  useful: {
    type: Sequelize.BOOLEAN,
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
  activity_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  timestamps: false,
  tableName: 'activity'
})

module.exports = Activity;
