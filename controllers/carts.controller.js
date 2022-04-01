// const { Cart } = require('../models/carts.model');
// const { Product } = require('../models/products.model');
// const { AppError } = require('../utils/appError');
// const { catchAsync } = require('../utils/catchAsync');
// const { Op } = require('sequelize');
// const { ProductsInCart } = require('../models/productsInCart.model');

// exports.getAllCart = catchAsync(async (req, res, next) => {
//   const cart = await Cart.findAll({
//     where: { status: 'active' }
//   });

//   if (cart.length === 0) {
//     return next(new AppError(404, 'cart not found'));
//   }
//   res.status(201).json({
//     status: 'success',
//     data: {
//       cart
//     }
//   });
// });

// exports.getCartById = catchAsync(async (req, res, next) => {
//   const { cart } = req;
//   // const { id } = req.params;
//   // const cart = await Cart.findOne({
//   //   where: { id: id, status: 'active' }
//   // });

//   // if (!cart) {
//   //   res.status(404)
//   //   return next(new AppError(404, 'the delivered was no found'));
//   // }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       cart
//     }
//   });
// });

// exports.addProduct = catchAsync(async (req, res, next) => {
//   const { productId, quantity } = req.body;
//   const { id } = req.currentUser;

//   const cart = await Cart.findOne({
//     where: { status: 'active', userId: id }
//   });

//   const product = await Product.findAll({
//     where: {
//       [Op.and]: [{ status: 'active', id: productId }],
//       quantity: {
//         [Op.gte]: quantity
//       }
//       //        [Op.gte]: [{quantity}]
//     }
//   });

//   if(product.length === 0){
//     res.status(401).json({
//       status: 'error',
//       message: 'There is not posible to add this quantity, please verify the'
//     });  
//     return
//   }

//   if (!cart) {
//     //log(primeraVezAgregarProducto)
//     const newCart = await Cart.create({
//       userId: id
//     });
//     const newProductInCart = await ProductsInCart.create({
//       cartId: newCart.id, 
//       productId: productId,
//       quantity: quantity
//     })
//   }

//   const existProductInCart = await ProductsInCart.findOne({
//     where: { productId: productId}
//   }) 

//   if(existProductInCart){
//     if(existProductInCart.status==="removed"){
//       await existProductInCart.update({
//         status: 'active', quantity: quantity
//       })
//     }

//     res.status(401).json({
//       status: 'error',
//       message: ' This product exist in the cart'
//     })
//   }




//   // Una consulta para saber si el producto existe en la tabla productsincarts
//   // van a hacerlo desde el modelo productsInCarts colocando el operador and [Op.and]
//   // let productExist = productsInCarts.findOne
//   // validaciones
//   // productExist -> existe el producto en el carrito
//   // !productExist -> no existe en el carrito -> entonces agregan el producto en la tabla productsInCarts
//   // productExist.status ==== 'removed' -> existe y hay que actualizar su status y cantidad

//   res.status(201).json({
//     status: 'success',
//     data: {
//       product
//     }
//   });
// });

// exports.deleteCart = catchAsync(async (req, res, next) => {
//   // const { id } = req.params;
//   // const cart = await Cart.findOne({
//   //   where: { id: id, status: 'active' }
//   // });
//   const { cart } = req;
//   // if (!cart) {
//   //   return next(
//   //     new AppError(400, `The selected id ${id} was not found, please verify it.`)
//   //   )
//   // }

//   await cart.update({ status: 'deleted' });

//   res.status(200).json({
//     status: 'success',
//     message: `The selected id ${id} was deleted.`,
//     data: {
//       cart
//     }
//   });
// });

// exports.deleteCartWithOutId = catchAsync(async (req, res, next) => {
//   // if(!cart === deleted){

//   // }
//   res.status(404).json({
//     status: 'error',
//     message: 'There are not was selected a valid ID, please add it'
//   });
// });

// Models
const { Cart } = require('../models/carts.model');
const { Product } = require('../models/products.model');
const { ProductInCart } = require('../models/productsInCart.model');
const { Order } = require('../models/orders.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { filterObj } = require('../utils/filterObj');

exports.getUserCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id },
    include: [
      {
        model: Product,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  res.status(200).json({ status: 'success', data: { cart } });
});

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  // Check if product to add, does not exceeds that requested amount
  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `This product only has ${product.quantity} items.`)
    );
  }

  // Check if user's cart is active, if not, create one
  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    // Create a new cart
    const newCart = await Cart.create({ userId: currentUser.id });

    await ProductInCart.create({
      productId,
      cartId: newCart.id,
      quantity
    });
  } else {
    // Cart already exists
    // Check if product is already in the cart
    const productExists = await ProductInCart.findOne({
      where: { cartId: cart.id, productId }
    });

    if (productExists && productExists.status === 'active') {
      return next(new AppError(400, 'This product is already in the cart'));
    }

    // If product is in the cart but was removed before, add it again
    if (productExists && productExists.status === 'removed') {
      await productExists.update({ status: 'active', quantity });
    }

    // Add new product to cart
    if (!productExists) {
      await ProductInCart.create({ cartId: cart.id, productId, quantity });
    }
  }

  res.status(201).json({ status: 'success' });
});

exports.updateCartProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  // Check if quantity exceeds available amount
  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `This product only has ${product.quantity} items`)
    );
  }

  // Find user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(400, 'This user does not have a cart yet'));
  }

  // Find the product in cart requested
  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(
      new AppError(404, `Can't update product, is not in the cart yet`)
    );
  }

  // If qty is 0, mark the product's status as removed
  if (quantity === 0) {
    await productInCart.update({ quantity: 0, status: 'removed' });
  }

  // Update product to new qty
  if (quantity > 0) {
    await productInCart.update({ quantity });
  }

  res.status(204).json({ status: 'success' });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId } = req.params;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(new AppError(404, 'This product does not exist in this cart'));
  }

  await productInCart.update({ status: 'removed', quantity: 0 });

  res.status(204).json({ status: 'success' });
});

exports.purchaseCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  // Find user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id },
    include: [
      {
        model: Product,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  let totalPrice = 0;

  // Update all products as purchased
  const cartPromises = cart.products.map(async (product) => {
    await product.productInCart.update({ status: 'purchased' });

    // Get total price of the order
    const productPrice = product.price * product.productInCart.quantity;

    totalPrice += productPrice;

    // Discount the quantity from the product
    const newQty = product.quantity - product.productInCart.quantity;

    return await product.update({ quantity: newQty });
  });

  await Promise.all(cartPromises);

  // Mark cart as purchased
  await cart.update({ status: 'purchased' });

  const newOrder = await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: Date.now().toLocaleString(),
    totalPrice
  });

  res.status(201).json({
    status: 'success',
    data: { newOrder }
  });
});
