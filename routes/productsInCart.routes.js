const express = require('express');

const {
  getAllproductInCart,
  getProductsInCartById,
  createProductInCart,
  deleteProductInCart,
  deleteProductInCartWithoutId
} = require('../controllers/productsInCart.controller');

const router = express.Router();

router.get('/', getAllproductInCart);

router.get('/:id', getProductsInCartById);

router.post('/', createProductInCart);

router.delete('/:id', deleteProductInCart);
router.delete('/', deleteProductInCartWithoutId);

module.exports = { productsincartRouter: router };
