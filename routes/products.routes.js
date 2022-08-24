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

//user schema
/**
 * @swagger
 * components:
 *  schemas:
 *     product:
 *        type: object
 *        properties:
 *          title:
 *              type: string
 *              description: This field must be name products
 *              max-length: 50 chars
 *          description:
 *              type: string
 *              description: description product
 *              max-length: 100 chars
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
 *          - title
 *          - description
 *          - quantity
 *          - price
 *          - userId
 *        example:
 *          title: watch
 *          descripton: reloj suizo pulso en titanio marca Tissot
 *          quantity: 36
 *          price: 200
 *          userId: 1
 */

router.use(validateSession)

//get all products
/**
 * @swagger
 * /api/v1/products/:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns all products 
 *    tags: [product]
 *    responses:
 *      201:
 *        description: returns all products
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/product'
 *      401:
 *        description: The token was not delivered/User not found.
 */
router.get('/', getAllProducts);

//Create newProduct
/**
 * @swagger
 * /api/v1/products/:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: allows create a new product 
 *    tags: [product]
 *    requestBody: 
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/product'
 *    responses:
 *      201:
 *        description: return the info product created
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/product'
 *      400:
 *        description: Some properties and/or their values are incorrect.
 *      401:
 *        description: The token was not delivered/User not found.
 */
router.post('/', createProductValidators, validateResult, createProduct);

router.use('/:id', productExists)
      .route('/:id')

//get product owner by id
/**
 * @swagger
 * /api/v1/products/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns id product 
 *    tags: [product]
 *    responses:
 *      200:
 *        description: returns id product
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/product'
 *      401:
 *        description: The token was not delivered/User not found.
 *      403:
 *        description: You are not the owner of this product.
 *      404:
 *        description: No product found with that ID.
 */
      .get(productOwner, getProductById)

//patch products owner
/**
 * @swagger
 * /api/v1/products/:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    summary: allows update the product owner by id 
 *    tags: [product]
 *    responses:
 *      201:
 *        description:  allows update the account owner by id
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/product'
 *      401:
 *        description: The token was not delivered/User not found.
 *      403:
 *        description: You are not the owner of this product.
 *      404:
 *        description: No product found with that ID.
 */

      .patch( productOwner, updateProductPatch)

//delete products owner
/**
 * @swagger
 * /api/v1/products/:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: allows delete the account owner user 
 *    tags: [product]
 *    responses:
 *      201:
 *        description:  allows delete the product owner user 
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/product'
 *      401:
 *        description: The token was not delivered/User not found.
 *      403:
 *        description: You are not the owner of this product.
 *      404:
 *        description: No product found with that ID.
 */
      .delete( productOwner, deleteProduct)


module.exports = { productRouter: router };
