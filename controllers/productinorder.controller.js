const {
  Productinorder
} = require('../models/productinorder.model');

exports.getAllProductInOrders = async (req, res) => {
  try {
    const productinorders = await Productinorder.findAll({
      where: { status: 'active' }
    });

    if (productinorders.length === 0) {
      res.status(200).json({
        status: 'success',
        message: 'There are not products created until.'
      });
      return;
    }
    res.status(201).json({
      status: 'success',
      data: {
        productinorders
      }
    });
  } catch (error) {
    console.log(error);
  }
  pro;
};

exports.createProductInOrder = async (req, res) => {
  try {
    const { orderId, productId, quantity, price } =
      req.body;
    const productinorder = await Productinorder.create({
      orderId: orderId,
      productId: productId,
      quantity: quantity,
      price: price
    });

    if (
      (!orderId ||
        !productId ||
        !quantity ||
        !price ||
        orderId.length === 0,
      productId.length === 0,
      quantity.length === 0,
      price.length === 0)
    ) {
      res.status(404).json({
        status: 'error',
        message:
          'Verify the properties names and their content'
      });
      return;
    }
    res.status(201).json({
      status: 'success',
      data: {
        productinorder
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateProductInOrderPatch = async (req, res) => {
  try {
    const { id } = req.params;

    const data = filterObj(
      req.body,
      'orderId',
      'productId',
      'quantity',
      'price'
    ); // { aciotns } | { action, status }

    const productinorder = await Productinorder.findOne({
      where: { id: id, status: 'active' }
    });

    if (!productinorder) {
      res.status(404).json({
        status: 'error',
        message: 'Cant update post, invalid ID'
      });
      return;
    }

    await productinorder.update({ ...data }); // .update({ action, status })
    res.status(204).json({ status: 'success' });
  } catch (error) {
    console.log(error);
  }
};

// Delete post
exports.deleteProductInOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const productinorder = await Productinorder.findOne({
      where: { id: id, status: 'active' }
    });

    if (!this.getAllProductInOrder) {
      res.status(404).json({
        status: 'error',
        message: 'Cant delete post, invalid ID'
      });
      return;
    }
    // Soft delete
    await productinorder.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
  } catch (error) {
    console.log(error);
  }
};
