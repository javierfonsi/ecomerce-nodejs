const { Cart } = require('../models/carts.model');
const { Product } = require('../models/products.model');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { Op } = require('sequelize');
const { ProductsInCart } = require('../models/productsInCart.model');

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
  const { productId, quantity } = req.body;
  const { id } = req.currentUser;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: id }
  });

  const product = await Product.findAll({
    where: {
      [Op.and]: [{ status: 'active', id: productId }],
      quantity: {
        [Op.gte]: quantity
      }
      //        [Op.gte]: [{quantity}]
    }
  });

  if(product.length === 0){
    res.status(401).json({
      status: 'error',
      message: 'There is not posible to add this quantity, please verify the'
    });  
    return
  }

  if (!cart) {
    //log(primeraVezAgregarProducto)
    const newCart = await Cart.create({
      userId: id
    });
    const newProductInCart = await ProductsInCart.create({
      cartId: newCart.id, 
      productId: productId,
      quantity: quantity
    })
  }

  const existProductInCart = await ProductsInCart.findOne({
    where: { productId: productId}
  }) 

  if(existProductInCart){
    if(existProductInCart.status==="removed"){
      await existProductInCart.update({
        status: 'active', quantity: quantity
      })
    }

    res.status(401).json({
      status: 'error',
      message: ' This product exist in the cart'
    })
  }




  // Una consulta para saber si el producto existe en la tabla productsincarts
  // van a hacerlo desde el modelo productsInCarts colocando el operador and [Op.and]
  // let productExist = productsInCarts.findOne
  // validaciones
  // productExist -> existe el producto en el carrito
  // !productExist -> no existe en el carrito -> entonces agregan el producto en la tabla productsInCarts
  // productExist.status ==== 'removed' -> existe y hay que actualizar su status y cantidad

  res.status(201).json({
    status: 'success',
    data: {
      product
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
    message: 'There are not was selected a valid ID, please add it'
  });
});
