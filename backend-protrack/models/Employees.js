const Sequelize = require('sequelize');
const sequelize2 = require('../config/db');
const Employees = sequelize2.define('employees', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull:  false
  },  
  password: {
    type:      Sequelize.STRING(50),
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
  first_name: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  middle_name: {
    type: Sequelize.STRING(20),
    allowNull:  true
  },
  last_name: {
    type:      Sequelize.STRING(20),
    allowNull: false
  },
  username: {
    type:       Sequelize.STRING(50),
    allowNull:  true, // or false if the username is required
  },
  role:{
    type:       Sequelize.STRING(50),
    allowNull:  true
  }
},{
timestamps: false,
}
);

module.exports = Employees;
