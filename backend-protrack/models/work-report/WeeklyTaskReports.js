const {Sequelize, DataTypes} = require('sequelize');
const Employees = require('../Employees');

const sequelize2= require('../../config/db');


const WeeklyTaskReports = sequelize2.define('weekly_task_reports',{

    id:{
        type:  DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    activity_id:{
        type: DataTypes.INTEGER,
        allowedNull:false
    },
    year_week:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    employee_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    task_description:{
        type: DataTypes.STRING(1000),
        allowNull:false ,
    },
    status:{
        type:  DataTypes.STRING(20),
        allowNull: false,
    },
    challenge_description:{
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: 'No Challenges Faced',
        
    },
    ai_tool:{
        type: DataTypes.STRING(100),
        allowNull:true,
        defaultValue: ''
    }
},
{
    tableName: 'weekly_task_reports',
    timestamps: false,
})


module.exports = WeeklyTaskReports;