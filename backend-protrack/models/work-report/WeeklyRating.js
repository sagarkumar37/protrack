const {Sequelize, DataTypes} = require('sequelize');
const Employees = require('../Employees');

const sequelize2 = require('../../config/db');

const WeeklyRating = sequelize2.define('weekly_ratings',{
    // Model attributes are defined here

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
    employee_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    busyness:{
        type: DataTypes.DECIMAL(6,2),
        defaultValue: null,

    },
    satisfaction:{
        type: DataTypes.DECIMAL(6,2),
        defaultValue: null

    },
    learning:{
        type: DataTypes.DECIMAL(6,2),
        defaultValue: null


    },
    core:{
        type: DataTypes.DECIMAL(6,2),
        defaultValue: null


    },
    skill_acquired:{
        type: DataTypes.STRING(100),
        defaultValue: null

    },
    ai_productivity:{
        type: DataTypes.DECIMAL(6,2),
        defaultValue: null
    },
}, {
    tableName: 'weekly_ratings',
    timestamps: false,
});


// id not defined because sequelize look for id field by default in this case the targetted key is id only in the employees model
WeeklyRating.belongsTo(Employees,{
    foreignKey: 'employee_id'
});

module.exports = WeeklyRating;