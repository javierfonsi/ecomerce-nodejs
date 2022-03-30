const { ProductsInCart } = require('../models/productsInCart.model');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.getAllproductInCart = catchAsync(async (req, res, next) => {
  
    const productsInCart = await ProductsInCart.findAll({
      where: { status: 'active' }
    });

    if (productsInCart.length === 0) {
      return next( new AppError(404,  'There are not productInCart created until.'))
    }

    res.status(201).json({
      status: 'success',
      data: {
        productsInCart
      }
    });
  
});

exports.getProductsInCartById = catchAsync(async (req, res, next) => {
  
    const { id } = req.params;
    const productInCart = await ProductsInCart.findOne({
      where: { id: id, status: 'active' }
    });

    if (!productInCart) {
      return next( new AppError(404,  `The selected Id ${id} was not found, please verify it.`))
    }

    res.status(200).json({
      status: 'success',
      data: {
        productInCart
      }
    });
});

exports.createProductInCart = catchAsync(async (req, res) => {
  
    const { cartId, productId, quantity, price } = req.body;

    if (
      !cartId ||
      !productId ||
      !quantity ||
      !price ||
      cartId < 1 ||
      productId < 1 ||
      quantity < 1 ||
      price.length < 1
    ) {
      return next( new AppError(404, 'verify the properties names and their values'))
    }

    const productInCart = await ProductsInCart.create({
      cartId: cartId,
      productId: productId,
      quantity: quantity,
      price: price
    });

    res.status(201).json({
      status: 'success',
      data: {
        productInCart
      }
    });
  
});

exports.deleteProductInCart = catchAsync(async (req, res, next) => {
  
    const { id } = req.params;
    const productInCart = await ProductsInCart.findOne({
      where: { id: id, status: 'active' }
    });

    if (!productInCart) {
      return next( new AppError(404, `The selected Id ${id} was not found, please verify it.`))
    }
    await productInCart.update({ status: 'deleted' });

    res.status(200).json({
      status: 'success',
      message: `The selected id ${id} was deleted.`,
      data: {
        productInCart
      }
    });

});

exports.deleteProductInCartWithoutId = catchAsync(async (req, res) => {

    res.status(404).json({
      status: 'error',
      message:
        'There are not was selected a valid ID, please add it'
    });

});
