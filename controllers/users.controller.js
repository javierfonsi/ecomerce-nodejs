const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/users.model');
const { Order } = require('../models/orders.model');
const { Product } = require('../models/products.model');

const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { filterObj } = require('../utils/filterObj');

dotenv.config({ path: './config.env' });

exports.createUser = catchAsync(async (req, res, next) => {
  const { userName, email, password } = req.body;

  // const salt = await bcrypt.genSalt(12);
  let passwordHash = await bcryptjs.hash(password, 8);
  const user = await User.create({
    userName: userName,
    email: email,
    password: passwordHash
  });

  user.password = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email: email, status: 'active' }
  });

  // Compare entered password vs hashed password
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  // Create JWT
  const token = await jwt.sign(
    { id: user.id }, // Token payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: { status: 'active' }
  });

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getAllUsersProducts = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  // console.log(currentUser.id);
  // const { id  } =req.params;

  const allproducts = await Product.findAll({
    where: { userId: currentUser.id, status: 'active' }
  });

  res.status(200).json({
    status: 'success',
    data: { allproducts }
  });
});

exports.getAllUsersOrder = catchAsync(async (req, res, nexr) => {
  const allOrders = await Order.findAll({
    where: { status: 'active' } // at the momment implement is needed change the status to purchased
  });

  res.status(200).json({
    status: 'success',
    data: {
      allOrders
    }
  });
});

exports.getAllUsersOrderbyId = catchAsync(async (req, res, nexr) => {
  const { currentUser } = req;
  const orders = await Order.findAll({
    where: { id: currentUser.id, status: 'active' } // at the momment implement is needed change the status to purchased
  });

  res.status(200).json({
    status: 'success',
    data: {
      orders
    }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  res.status(200).json({ status: 'success', data: { currentUser } });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = filterObj(req.body, 'userName', 'email');

  await user.update({ ...data });

  res.status(201).json({
    status: 'success',
    message: `The user with id ${user.id} was update correctly`
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: `The user with id ${user.id} was deleted correctly`
  });
});



