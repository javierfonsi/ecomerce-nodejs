const { Order } = require('../models/orders.model');

const { filterObj } = require('../utils/filterObj')

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: 'active' }
    });

    if (orders.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'There are not orders created until.'
      });
      return;
    }
    res.status(201).json({
      status: 'success',
      data: {
        orders
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { totalPrice, userId } = req.body;

    if (
      !totalPrice || !userId 
    ) {
      res.status(404).json({
        status: 'error',
        message:
          'Verify the properties names and their content'
      });
      return;
    }

    const order = await Order.create({
      totalPrice: totalPrice,
      userId: userId
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.updateOrderPatch = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const data = filterObj(
//       req.body,      
//       'totalPrice'      
//     ); // { aciotns } | { action, status }

//     const order = await Order.findOne({
//       where: { id: id, status: 'active' }
//     });

//     if (!order) {
//       res.status(404).json({
//         status: 'error',
//         message: 'Cant update post, invalid ID'
//       });
//       return;
//     }

//     await order.update({ ...data }); // .update({ action, status })
//     res.status(204).json({ status: 'success' });
//   } catch (error) {
//     console.log(error);
//   }
// };

// Delete post
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id: id, status: 'active' }
    });

    if (!order) {
      res.status(404).json({
        status: 'error',
        message: 'Cant delete post, invalid ID'
      });
      return;
    }
    // Soft delete
    await order.update({ status: 'deleted'});

    res.status(201).json({       
      status: 'success', 
      message: 'The order was deleted'
    });
  } catch (error) {
    console.log(error);
  } 
};

exports.deleteOrderWithOutId = async(req, res) => {
  try {
    res.status(404).json({
      status: 'error',
      message: 'Put an id valid'
    })
    
  } catch (error) {
    console.log(error)
  }
}