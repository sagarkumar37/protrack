const Sequelize   = require("sequelize");
const sequelize2  = require("../config/db");
const DaysActivities = sequelize2.define("days_activity", {
    activity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "activity",
        key:   "activity_id",
      },
    },
    effort_placed: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    employee: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "employees",
        key: "id",
      },
    },
    day: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "dates",
        key: "date_id",
      },
    },
  });
  
  module.exports = DaysActivities;