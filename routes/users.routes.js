const express = require('express');

const {
  getAllUsers,
  createUser,
  loginUser,
  getAllUsersProducts,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsersOrder,
  getAllUsersOrderbyId
} = require('../controllers/users.controller');

const { validateSession, protectAccountOwner } = require('../middlewares/auth.middlewares');

const { userExists } = require('../middlewares/user.middlewares');

const { createUserValidators, validateResult } = require('../middlewares/validators.middleware');

//user schema
/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 *  schemas:
 *     user:
 *        type: object
 *        properties:
 *          username:
 *              type: string
 *              description: This field must be identifying the user
 *              max-length: 50 chars
 *          email:
 *              type: string
 *              description: Email user
 *              max-length: 50 chars
 *          password:
 *              type: string
 *              description: password user
 *              max-length: 15 chars
 *        required:
 *          - username
 *          - email
 *          - password
 *        example:
 *          userName: Jenifer_Aniston
 *          email: j.aniston@gmail.com
 *          password: 1234@admin
 *          role: user
 *     loggedUser:
 *        type: object
 *        properties:
 *          email:
 *              type: string
 *              description: Email user.
 *              max-length: 50 chars
 *          password:
 *              type: string
 *              description: password user.
 *              max-length: 15 chars
 *        required:
 *          - email
 *          - password
 *        example:
 *          email: j.aniston@gmail.com
 *          password: 1234@admin
 */

const router = express.Router();

//Create newUser
/**
 * @swagger
 * /api/v1/users/:
 *  post:
 *    summary: allows create a new user 
 *    tags: [user]
 *    requestBody: 
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/user'
 *    responses:
 *      201:
 *        description: return the info user created
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/user'
 *      400:
 *        description: Some properties and/or their values are incorrect.
 */

router.post('/', createUserValidators, validateResult, createUser);

//login user
/**
 * @swagger
 * /api/v1/users/login:
 *  post:
 *    summary: allows login a user 
 *    tags: [user]
 *    requestBody: 
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/loggedUser'
 *    responses:
 *      200:
 *        description: Return a valid token 
 *      400:
 *        description: Credentials are invalid.
 */
router.post('/login', loginUser);

//get all user
/**
 * @swagger
 * /api/v1/users/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns all user 
 *    tags: [user]
 *    responses:
 *      200:
 *        description: returns all user
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/user'
 *      401:
 *        description: The token was not delivered/User not found.
 */
router.use('/all', validateSession).get('/all', getAllUsers);

router.use(validateSession)

//get all products from user logged
/**
 * @swagger
 * /api/v1/users/me:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns all products from user logged 
 *    tags: [product]
 *    responses:
 *      200:
 *        description: returns all products from user logged
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/product'
 *      401:
 *        description: The token was not delivered/User not found.
 */
router.get('/me', getAllUsersProducts); //Por validar luego de agregar productos

//get all orders from user logged
/**
 * @swagger
 * /api/v1/users/orders:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns all orders by user logged
 *    tags: [order]
 *    responses:
 *      200:
 *        description: returns all orders by user
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/order'
 *      401:
 *        description: The token was not delivered/User not found.
 */
router.get('/orders', getAllUsersOrder)

//get orders by id from user logged
/**
 * @swagger
 * /api/v1/users/orders/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns the order by id from user logged 
 *    tags: [order]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: According to order id
 *    responses:
 *      200:
 *        description: returns orders by id from user logged
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/order'
 *      401:
 *        description: The token was not delivered/User not found.
 *      403:
 *        description: You can't update or delete other users account.
 */
router.get('/orders/:id', protectAccountOwner, getAllUsersOrderbyId)

router.use('/:id', userExists)

//get user by id
/**
 * @swagger
 * /api/v1/users/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns the user according to id
 *    tags: [user]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: According to user id
 *    responses:
 *      200:
 *        description: returns the user according to id
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/user'
 *      401:
 *        description: The token was not delivered/User not found.
 *      404:
 *        description: The selected user id was not found.
 */
router.route('/:id').get(getUserById)

//patch user account owner
/**
 * @swagger
 * /api/v1/users/:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    summary: allows update the data account owner user 
 *    tags: [user]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: According to user id
 *    responses:
 *      201:
 *        description:  The data account owner user was update correctly 
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/user'
 *      401:
 *        description: The token was not delivered/User not found.
 *      403:
 *        description: You can't update or delete other users account.
 *      404:
 *        description: The selected user id was not found.
 */
  .patch(protectAccountOwner, updateUser)

//delete user account owner
/**
 * @swagger
 * /api/v1/users/:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: allows delete the account owner user 
 *    tags: [user]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: According to user id
 *    responses:
 *      201:
 *        description:  the account owner user was deleted correctly 
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/user'
 *      401:
 *        description: The token was not delivered/User not found.
 *      403:
 *        description: You can't update or delete other users account.
 *      404:
 *        description: There are not users util. The selected user id was not found.
 */
  .delete(protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
