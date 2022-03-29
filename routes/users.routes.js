const express = require('express');
const { app } = require('../app');

const {
  getAllUsers,
  createUser,
  loginUser
} = require('../controllers/users.controller');

const { validateSession } = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/login', loginUser);
router.post('/', createUser);

router.use(validateSession)
router.get('/', getAllUsers);
//router.get('/me', getAllUsersProducts);

module.exports = { usersRouter: router };
