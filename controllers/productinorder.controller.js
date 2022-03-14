const { Productinorder } = require('../models/productinorder.model');


const { filterObj } = require('../utils/filterObj')

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
};

exports.createProductInOrder = async (req, res) => {
  try {
    const { orderId, productId, quantity, price } = req.body;

    if (!orderId || !productId || !quantity || !price) {
      res.status(404).json({
        status: 'error',
        message: 'Verify the properties names and their content'
      });
      return;
    }

    const productinorder = await Productinorder.create({
      orderId: orderId,
      productId: productId,
      quantity: quantity,
      price: price
    });

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
      // 'orderId',
      // 'productId',
      'quantity'
      // 'price'
    ); // { aciotns } | { action, status }

    const productinorder = await Productinorder.findOne({
      where: { id: id, status: 'active' }
    });

    if (!productinorder) {
      res.status(404).json({
        status: 'error',
        message: 'Cant update product in order, invalid ID'
      });
      return;
    }

    await productinorder.update({ ...data }); // .update({ action, status })

    res.status(204).json({ 
      status: 'success',
      message: 'The values was updated',
      data:{
        productinorder
      }
     });
     console.log("Elimando")
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

    if (!productinorder) {
      res.status(404).json({
        status: 'error',
        message: 'Cant delete post, invalid ID'
      });
      return;
    }
    // Soft delete
    await productinorder.update({ status: 'deleted' });

    res.status(204).json({
      status: 'success',
      message: 'Deleted Id'
    });
  } catch (error) {
    console.log(error);
  }
};
