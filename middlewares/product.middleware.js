// Models
const { Product } = require("../models/products.model");

// Utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.productExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id, status: "active" } });
  console.log(product)

  if (!product) {
    return next(new AppError(404, "No product found with that ID"));
  }
  req.product = product;
  next();
});
