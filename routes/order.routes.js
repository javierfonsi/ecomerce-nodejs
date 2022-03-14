const express = require('express');

const {
  getAllOrders,
  createOrder,
  // updateOrderPatch,
  deleteOrder,
  deleteOrderWithOutId
} = require('../controllers/order.controller');

const router = express.Router();

router.get('/', getAllOrders);

router.post('/', createOrder);

// router.patch('/:id', updateOrderPatch);

router.delete('/:id', deleteOrder);

router.delete('/', deleteOrderWithOutId);

module.exports = { ordersRouter: router };
// module.exports = router // export default router
