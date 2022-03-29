const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Product = sequelize.define('product', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
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
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
module.exports = { Product };
// ○ Product (id, name, price, availableQty, status, userId)
