const { validationResult } = require('express-validator');

//Models
const { Product } = require('../models/products.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { filterObj } = require('../utils/filterObj');


exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
      where: { status: 'active' }
    });

    if (products.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'there are not products created until.'
      });
      return;
    }
    res.status(201).json({
      status: 'success',
      data: {
        products
      }
    });
}) 

exports.getProductById = catchAsync(async (req, res, next) => {  
  const { product } = req;

  console.log(req)

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.createProduct = async (req, res, next) => {
    const { title, description, quantity, price, userId } = req.body;
   
    const newProduct = await Product.create({
      title,
      description,
      quantity,
      price,
      userId
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        newProduct
      }
    });  
};

exports.updateProductPatch = catchAsync(async (req, res, next) => {
  const { product } = req;

  const data = filterObj(
    req.body,
    'title',
    'description',
    'quantity',
    'price' 
  );

  await product.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
