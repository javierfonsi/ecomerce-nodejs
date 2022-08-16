//Models
const { Product } = require('../models/products.model');
const { User } = require('../models/users.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { filterObj } = require('../utils/filterObj');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: [{ model: User, attributes: { exclude: ['password'] } }]
  });

  // if (products.length === 0) {
  //   res.status(404).json({
  //     status: 'error',
  //     message: 'there are not products created until.'
  //   });
  //   return;
  // }
  res.status(201).json({
    status: 'success',
    data: {
      products
    }
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price } = req.body;
  const { id } = req.currentUser;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    userId: id
  });

  res.status(201).json({
    status: 'success',
    data: { newProduct }
  });
});

exports.updateProductPatch = catchAsync(async (req, res, next) => {
  const { product } = req;

  const data = filterObj(
    req.body,
    'title',
    'description',
    'quantity',
    'price'
    // id: product.userId
  );

  await product.update({ ...data });

  res.status(201).json({
    status: 'success',
    message: `The product id ${product.id} was update correctly`
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res
    .status(201)
    .json({
      status: 'success',
      message: `The product id ${product.id} was update correctly`
    });
});
