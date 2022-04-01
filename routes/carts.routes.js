const express = require('express');

const {
  getAllCart,
  addProduct,
  getCartById,
  deleteCart,
  deleteCartWithOutId
} = require('../controllers/carts.controller');

const { validateSession } = require('../middlewares/auth.middlewares');

const { cartExists } =require('../middlewares/cart.middlewares')

const router = express.Router();


router.use(validateSession)
//router.get('/', getAllCart);
router.post('/addProduct', addProduct);


router.get('/:id', getCartById);


router.use('/:id', cartExists)

router.delete('/:id', deleteCart);
router.delete('/', deleteCartWithOutId);

module.exports = { cartsRouter: router };
