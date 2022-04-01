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

const router = express.Router();

router.post('/login', loginUser);
router.post('/', createUserValidators, validateResult, createUser);

router.use(validateSession)

router.get('/', getAllUsers);

router.get('/me', getAllUsersProducts);

router.get('/orders', getAllUsersOrder)

router.get('/orders/:id', protectAccountOwner, getAllUsersOrderbyId)

router.use('/:id', userExists)

router.route('/:id').get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
