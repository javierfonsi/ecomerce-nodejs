const { Cart } = require('../models/carts.model');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.getAllCart = catchAsync(async (req, res, next) => {
 
    const cart = await Cart.findAll({
      where: { status: 'active' }
    });

    if (cart.length === 0) {
      return next(new AppError(404, 'cart not found'));
      
    }
    res.status(201).json({
      status: 'success',
      data: {
        cart
      }
    });
  
});

exports.getCartById = catchAsync(async (req, res, next) => {

  const { cart } = req;
    // const { id } = req.params;
    // const cart = await Cart.findOne({
    //   where: { id: id, status: 'active' }
    // });

    // if (!cart) {
    //   res.status(404)
    //   return next(new AppError(404, 'the delivered was no found'));
    // }

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
    });
  
});

exports.addProduct = catchAsync(async (req, res, next) => {
  
    const { userId, totalPrice } = req.body;

    if (!userId || !totalPrice || totalPrice.length < 1) {
      return next(
        new AppError(400, 'verify the properties userId and their totalPrice')
      )
    }

    const newCart = await Cart.create({
      userId: userId,
      totalPrice: totalPrice
    });

    res.status(201).json({
      status: 'success',
      data: {
        newCart
      }
    });
 
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  
    // const { id } = req.params;
    // const cart = await Cart.findOne({
    //   where: { id: id, status: 'active' }
    // });
    const { cart } = req;
    // if (!cart) {
    //   return next(
    //     new AppError(400, `The selected id ${id} was not found, please verify it.`)
    //   )
    // }

    await cart.update({ status: 'deleted' });

    res.status(200).json({
      status: 'success',
      message: `The selected id ${id} was deleted.`,
      data: {
        cart
      }
    });
 
});

exports.deleteCartWithOutId = catchAsync(async (req, res, next) => {
  // if(!cart === deleted){
    
  // }
    res.status(404).json({
      status: 'error',
      message:
        'There are not was selected a valid ID, please add it'
    });
  
});
