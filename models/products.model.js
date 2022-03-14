const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Product = sequelize.define('product', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  price: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  availableQty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  }
});
module.exports = { Product };
// ○ Product (id, name, price, availableQty, status, userId)
