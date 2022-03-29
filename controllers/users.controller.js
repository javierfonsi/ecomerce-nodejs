const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/users.model');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { Cart } = require('../models/carts.model');

dotenv.config({ path: './config.env' });

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
  where: { status: 'active' }
});

if (users.length === 0) {
  res.status(200).json({
    status: 'success',
    message: 'there are not users created until.'
  });
  return;
}
res.status(201).json({
  status: 'success',
  data: {
    users
  }
});  
}) 

exports.createUser = catchAsync(async (req, res, next) => {
  const { userName, email, password } = req.body;

  if 
  ( !userName ||
    !email ||
    !password &&
    userName.length === 0 ||
    email.length === 0 ||
    password.length === 0)
{
  return next(new AppError(404, 'verify the properties names and their content'));
}

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
}) 

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {email: email, status: 'active' }
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
})

//exports.getAllUsersProducts = catchAsync(async (req, res, next) => {
//  const { id } = req.params

//  const allproducts = await Cart.findAll({
//    where: {id: id, status: active}
//  }) 

//}
//)