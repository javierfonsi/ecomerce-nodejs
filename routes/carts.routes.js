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
  addProductToCart,
  getUserCart,
  updateCartProduct,
  removeProductFromCart,
  purchaseCart
} = require('../controllers/carts.controller');

// Middleware
const { validateSession } = require('../middlewares/auth.middlewares');
const {
  addProductToCartValidation,
  validateResult
} = require('../middlewares/validators.middleware');

const router = express.Router();

router.use(validateSession);

router.get('/', getUserCart);

router.post('/add-product', addProductToCartValidation, validateResult, addProductToCart);

router.patch('/update-product', updateCartProduct);

router.post('/purchase', purchaseCart);

router.delete('/:productId', removeProductFromCart);

module.exports = { cartsRouter: router };