const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Productinorder = sequelize.define('productinorder', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  }
});
module.exports = { Productinorder };
