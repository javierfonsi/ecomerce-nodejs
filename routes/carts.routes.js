// const express = require('express');

// const {
//   getAllCart,
//   addProduct,
//   getCartById,
//   deleteCart,
//   deleteCartWithOutId
// } = require('../controllers/carts.controller');

// const { validateSession } = require('../middlewares/auth.middlewares');

// const { cartExists } =require('../middlewares/cart.middlewares')

// const router = express.Router();


// router.use(validateSession)
// //router.get('/', getAllCart);
// router.post('/addProduct', addProduct);


// router.get('/:id', getCartById);


// router.use('/:id', cartExists)

// router.delete('/:id', deleteCart);
// router.delete('/', deleteCartWithOutId);

// module.exports = { cartsRouter: router };

const express = require('express');

// Controller
const {
  getAllCart,
  getCartByUser,
  update_cartProduct,
  addProduct,
  purchase_Cart,
  remove_ProductFromCart,
} = require('../controllers/carts.controller');

// Middleware
const { validateSession } = require('../middlewares/auth.middlewares');

const { cartExists } =require('../middlewares/cart.middlewares');
const { validateResult, addProductInCartValidation } = require('../middlewares/validators.middleware');

const router = express.Router();

router.use(validateSession)
router.get('/', getAllCart); //To de future only for admin
router.get('/', cartExists, getCartByUser); //The userId is taken from token and cart exist is create to the future

router.post('/addProduct', addProductInCartValidation, validateResult, addProduct);

router.use('/update-cart', update_cartProduct)

router.post('/purchase', purchase_Cart);

router.delete('/:productId', remove_ProductFromCart);

module.exports = { cartsRouter: router };