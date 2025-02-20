const { Sequelize } = require('sequelize');

const sequelize2 = require('../config/db');


const Customers = sequelize2.define('customers', {
  customer_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  customer_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = Customers;
