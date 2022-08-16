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
 *          username: Jenifer_Aniston
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
 *        description: return the info user
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/user'
 *      400:
 *        description: Some properties are incorrect.
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
 *      404:
 *        description: Credentials are invalid.
 */
router.post('/login', loginUser);

//get all user
/**
 * @swagger
 * /api/v1/users:
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
 *                    $ref: '#/components/schemas/User'
 *      401:
 *        description: The token was not delivered/User not found.
 *      404:
 *        description: There are not users util.
 */
router.use('/all', validateSession).get('/all', getAllUsers);

router.use(validateSession)

//get all user
/**
 * @swagger
 * /api/v1/me:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: returns all products 
 *    tags: [products]
 *    responses:
 *      201:
 *        description: returns all products
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  items:
 *                    $ref: '#/components/schemas/products'
 *      401:
 *        description: The token was not delivered/User not found.
 *      404:
 *        description: There are not products util.
 */
router.get('/me', getAllUsersProducts); //Por validar luego de agregar productos

router.get('/orders', getAllUsersOrder)

router.get('/orders/:id', protectAccountOwner, getAllUsersOrderbyId)

router.use('/:id', userExists)

router.route('/:id').get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
