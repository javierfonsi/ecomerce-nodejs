const express = require('express');

const {
  getAllProductInOrders,
  createProductInOrder,
  updateProductInOrderPatch,
  deleteProductInOrder
} = require('../controllers/productinorder.controller');

const router = express.Router();

router.get('/', getAllProductInOrders);

router.post('/', createProductInOrder);

router.patch('/:id', updateProductInOrderPatch);

router.delete('/:id', deleteProductInOrder);

module.exports = { productinordersRouter: router };
// module.exports = router // export default router
