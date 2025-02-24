const {Sequelize, DataTypes} = require('sequelize');
const Employees = require('../Employees');
const Activity = require('../Activity'); 
const sequelize2= require('../../config/db');


const week_plan = sequelize2.define('weekly_plan_reports_v2',{

    id:{
        type:  DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    year_week:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activity_id:{
        type: DataTypes.INTEGER,
        allowedNull:false
    },
    // year_week:{
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
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
        defaultValue: 'Planned'
    },
    due_date: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
{
    tableName: 'weekly_plan_reports_v2',
    timestamps: false,
})

week_plan.belongsTo(Activity, { foreignKey: 'activity_id', as: 'activity' });

module.exports = week_plan;