const express = require('express');

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductPatch,
  deleteProduct
} = require('../controllers/products.controller');

//user schema
/**
 * @swagger
 * components:
 *  schemas:
 *     products:
 *        type: object
 *        properties:
 *          title:
 *              type: string
 *              description: This field must be name products
 *              max-length: 50 chars
 *          description:
 *              type: string
 *              description: description product
 *              max-length: 50 chars
 *          quantity:
 *              type: integer
 *              description: quantity products
 *          price:
 *              type: integer
 *              description: price products
 *          userId:
 *              type: integer
 *              description: id user
 *        required:
 *          - username
 *          - email
 *          - password
 *          - userId
 *        example:
 *          username: Reloj
 *          descripton: reloj de pulso suizo marca Tissot
 *          quantity: 36
 *          userId: 1
 */

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
