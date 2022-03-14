const { Order } = require("../models/order.model");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { status: "active" } });

    if (orders.length === 0) {
      res.status(200).json({
        status: "success",
        message: "There are not products created until.",
      });
      return;
    }
    res.status(201).json({
      status: "success",
      data: {
        orders,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createOrder = async (req, res) => {
    try {
    const { totalPrice, userId } = req.body;
    const order = await Order.create({
        totalPrice: totalPrice,         
        userId: userId
    });

    if (
      (!totalPrice || !userId ||
      totalPrice.length === 0,
      userId.length === 0
      )
    ) {
      res.status(404).json({
        status: "error",
        message: "Verify the properties names and their content",
      });
      return;
    }
    res.status(201).json({
      status: "success",
      data: {
        order
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateOrderPatch = async (req, res) => {
  try {
    const { id } = req.params;

    const data = filterObj(req.body, 'totalPrice', 'userId'); // { aciotns } | { action, status }

    const order = await Order.findOne({
      where: { id: id, status: 'active' }
    });

    if (!order) {
      res.status(404).json({
        status: 'error',
        message: 'Cant update post, invalid ID'
      });
      return;
    }

    await order.update({ ...data }); // .update({ action, status })
    res.status(204).json({ status: 'success' });
  } catch (error) {
    console.log(error);
  }
};

// Delete post
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id: id, status: 'active' }
    });

    if (!this.getAllOrder) {
      res.status(404).json({
        status: 'error',
        message: 'Cant delete post, invalid ID'
      });
      return;
    }
    // Soft delete
    await order.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
  } catch (error) {
    console.log(error);
  }
};