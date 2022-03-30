const express = require('express');
const { app } = require('../app');

const {
  getAllUsers,
  createUser,
  loginUser,
  getAllUsersProducts
} = require('../controllers/users.controller');

const { validateSession } = require('../middlewares/auth.middlewares');
const { userExists } = require('../middlewares/user.middlewares');

const router = express.Router();

router.post('/login', loginUser);
router.post('/', createUser);

router.use(validateSession)
router.get('/', getAllUsers);
router.get('/me', userExists, getAllUsersProducts);

module.exports = { usersRouter: router };
