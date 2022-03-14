const express = require('express');

const {
  getAllCart,
  createCart,
  getCartById,
  deleteCart,
  deleteCartWithOutId
} = require('../controllers/carts.controller');

const router = express.Router();

router.get('/', getAllCart);

router.get('/:id', getCartById);

router.post('/', createCart);

router.delete('/:id', deleteCart);
router.delete('/', deleteCartWithOutId);

module.exports = { cartsRouter: router };
