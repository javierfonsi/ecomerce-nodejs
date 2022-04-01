const express = require('express');

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductPatch,
  deleteProduct
} = require('../controllers/products.controller');

//middlewares
const { validateSession } = require('../middlewares/auth.middlewares');
const { productExists, 
  productOwner 
} = require('../middlewares/product.middleware');

const { createProductValidators, 
  validateResult 
} = require('../middlewares/validators.middleware');

const router = express.Router();

router.use(validateSession)
router.get('/', getAllProducts);

router.post('/', createProductValidators, validateResult, createProduct);

router.use('/:id', productExists)
      .route('/:id')
      .get(productOwner, getProductById)
      .patch( productOwner, updateProductPatch)
      .delete( productOwner, deleteProduct)


module.exports = { productRouter: router };
