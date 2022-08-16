//models
const { Cart } = require('../models/carts.model');
const { Product } = require('../models/products.model');
const { ProductsInCart } = require('../models/productsInCart.model');
const { Order } = require('../models/orders.model');

//sequelize
const { Op } = require('sequelize');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.getAllCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findAll({
    where: { status: 'active' },
    include: [
      {
        model: Product,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (cart.length === 0) {
    return next(new AppError(404, 'There are not products create in cart'));
  }
});

exports.getCartByUser = catchAsync(async (req, res, next) => {
  const { cart } = req;

  // Check if product to add, does not exceeds that requested amount
  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { currentUser } = req;

  //1. Find a product with userId from token and status "active"
  const product = await Product.findOne({
    where: { [Op.and]: [{ id: productId, status: 'active' }] }
  });

  if (!product)
    return next(
      new AppError(400, `Product id ${currentUser.id} does not exist`)
    );

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `This product only has ${product.quantity} items.`)
    );
  }

  //const product = await Product.findAll({
  //  where: {
  //    [Op.and]: [{ status: 'active', id: productId }],
  //    quantity: {
  //      [Op.gte]: quantity
  //    }
  //    //        [Op.gte]: [{quantity}]
  //  }
  //});

  //if(product.length === 0){
  //  res.status(401).json({
  //    status: 'error',
  //    message: 'There is not posible to add this quantity, please verify the'
  //  });
  //  return
  //}

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    //first product add
    const newCart = await Cart.create({
      userId: currentUser.id
    });
    const newProductInCart = await ProductsInCart.create({
      cartId: newCart.id,
      productId: productId,
      quantity: quantity
    });
  } else {
    // Cart already exists
    // Check if product is already in the cart
    const existProductInCart = await ProductsInCart.findOne({
      where: { cartId: cart.id, productId: productId }
    });

    if (existProductInCart && existProductInCart.status === 'active') {
      return next(
        new AppError(
          400,
          'The selected product exist in the cart, please verify it '
        )
      );
    }

    if (existProductInCart && existProductInCart.status === 'removed') {
      await existProductInCart.update({ status: 'active', quantity: quantity });
    }

    // Add new product to cart
    if (!existProductInCart) {
      await ProductsInCart.create({ cartId: cart.id, productId, quantity });
    }
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
    message: 'The product was add to cart correcty'
  });

  if (!productInCart) {
    return next(new AppError(404, 'This product does not exist in this cart'));
  }

  await productInCart.update({ status: 'removed', quantity: 0 });

  res.status(204).json({ status: 'success' });
});

exports.update_cartProduct = catchAsync(async (req, res, next) => {
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
  const productInCart = await ProductsInCart.findOne({
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

exports.purchase_Cart = catchAsync(async (req, res, next) => {
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
    await product.productsincart.update({ status: 'purchased' });

    // Get total price of the order
    const productPrice = product.price * product.productsincart.quantity;

    totalPrice += productPrice;

    // Discount the quantity from the product
    const newQty = product.quantity - product.productsincart.quantity;

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

exports.remove_ProductFromCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId } = req.params;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  const productInCart = await ProductsInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(new AppError(404, 'This product does not exist in this cart'));
  }

  await productInCart.update({ status: 'removed', quantity: 0 });

  res.status(204).json({ status: 'success' });
});
