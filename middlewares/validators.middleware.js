const { body, validationResult } = require('express-validator');

// Util
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

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
    .withMessage('Price mayor a cero'),
  body('userId')
    .isNumeric({ min: 1 })
    .withMessage('Must provide at least one user id')
];

// END: Products validators


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