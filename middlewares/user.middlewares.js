//models
const { User } = require("../models/users.model");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.userExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
  
    const user = await User.findOne({
      where: { id, status: 'active' },
      attributes: { exclude: ['password'] }
    });
  
    if (!user) {
      return next(new AppError(404, `The id ${id} selected was not found`));
    }
  
    req.user = user;
    next();
  });