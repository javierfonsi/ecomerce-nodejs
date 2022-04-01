const { body, validationResult } = require('express-validator');

// Util
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

// User validators

exports.createUserValidators = [
  body('userName')
    .isString()
    .withMessage('userName must be a string')
    .notEmpty()
    .withMessage('Must provide a valid useName'),
  body('email')
    .isEmail()
    .withMessage('email must be a string')
    .notEmpty()
    .withMessage('Must provide a valid email account'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('password must be alphanumeric values'),
];
// END: user validators

// Products validators
exports.createProductValidators = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Must provide a valid title'),
  body('description')
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('Must provide a valid description'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0 )
    .withMessage('Quantity mayor a cero'),
    body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value > 0 )
    .withMessage('Price mayor a cero')
];

// END: Products validators

<<<<<<< HEAD
// ProductInCartValidators
exports.addProductInCartValidation = [
=======
// Cart validations

exports.addProductToCartValidation = [
>>>>>>> daa12f0412f0c7c49069f62c2c0c4542ab5c961c
  body('productId')
    .isNumeric()
    .withMessage('Product id must be a number')
    .custom((value) => value > 0)
    .withMessage('Must provide a valid id'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0')
];
<<<<<<< HEAD
// END: ProductInCartValidators
=======

>>>>>>> daa12f0412f0c7c49069f62c2c0c4542ab5c961c

exports.validateResult = catchAsync(async (req, res, next) => {
  // Validate req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [msg, msg, msg, msg] -> msg. msg. msg...
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');

    return next(new AppError(400, errorMsg));
  }

  next();
});