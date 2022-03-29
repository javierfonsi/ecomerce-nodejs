const express = require('express');
const { body } = require('express-validator');

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductPatch,
  deleteProduct
} = require('../controllers/products.controller');

const { productExists } = require('../middlewares/product.middleware');

const { createProductValidators, validateResult } = require('../middlewares/validators.middleware');

const router = express.Router();

router.get('/', getAllProducts);

router.post('/', createProductValidators, validateResult, createProduct);

router.use('/:id', productExists)
      .route('/:id')
      .get(getProductById)
      .patch(updateProductPatch)
      .delete(deleteProduct)


module.exports = { productRouter: router };
