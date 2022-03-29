const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Order = sequelize.define('order', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  issuedAt: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  active: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  }
});
module.exports = { Order };
