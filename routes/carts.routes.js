const express = require('express');

const {
  getAllCart,
  addProduct,
  getCartById,
  deleteCart,
  deleteCartWithOutId
} = require('../controllers/carts.controller');

const { cartExists } =require('../middlewares/cart.middlewares')

const router = express.Router();

router.get('/', getAllCart);

router.get('/:id', getCartById);

router.post('/', addProduct);

router.use('/:id', cartExists)

router.delete('/:id', deleteCart);
router.delete('/', deleteCartWithOutId);

module.exports = { cartsRouter: router };
