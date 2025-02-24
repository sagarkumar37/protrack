const {Sequelize, DataTypes} = require("sequelize");
const sequelize2 = require("../config/db");
const Employees = require('./Employees');


const LoginLogs = sequelize2.define('loginlogs', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    primaryKey: true
  },

  employeecode: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Employee',
      key: 'id'
    },
  },
  start_time: {
    type: Sequelize.TIME,
    allowNull: true
  },
  end_time: {
    type: Sequelize.TIME,
    allowNull: true
  },
  hours: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  weekend: {
    type: Sequelize.TINYINT(1),
    allowNull: true
  },
  on_leave: {
    type: Sequelize.TINYINT(1),
    allowNull: true
  },
  holiday: {
    type: Sequelize.TINYINT(1),
    allowNull: true
  },
}, {
  tableName: 'loginlogs',
  timestamps: false
})
LoginLogs.belongsTo(Employees, { foreignKey: 'employeecode', as: 'empcode' });
module.exports = LoginLogs;


// const LoginLogs = sequelize2.define("loginlogs", {
//   date: {
//     type: Sequelize.DATE,
//     allowNull: false,
//   },
//   // date_id: {
//   //   type: Sequelize.INTEGER,
//   //   allowNull: false,
//   //   autoIncrement: true,
//   //   primaryKey: true,
//   // },
//   employeecode: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     references: {
//       model: "employees",
//       key: "id",
//     },
//   },
//   start_time: {
//     type: Sequelize.TIME,
//     allowNull: true,
//   },
//   end_time: {
//     type: Sequelize.TIME,
//     allowNull: true,
//   },
//   hours: {
//     type: Sequelize.FLOAT,
//     allowNull: true,
//   },
//   weekend: {
//     type: Sequelize.TINYINT(1),
//     allowNull: true,
//   },
//   on_leave: {
//     type: Sequelize.TINYINT(1),
//     allowNull: true,
//   },
//   holiday: {
//     type: Sequelize.TINYINT(1),
//     allowNull: true,
//   },
// },{
//   timestamps: false,
//   });