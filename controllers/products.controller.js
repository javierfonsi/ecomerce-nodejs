const { Product } = require('../models/products.model');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: 'active' }
    });

    if (products.length === 0) {
      res.status(200).json({
        status: 'success',
        message: 'there are not products created until.'
      });
      return;
    }
    res.status(201).json({
      status: 'success',
      data: {
        products
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, availableQty, userId } = req.body;
    const product = await Product.create({
      name: name,
      price: price,
      availableQty: availableQty,
      userId: userId
    });

    if (
      (!name ||
        !price ||
        !availableQty ||
        !userId ||
        name.length === 0,
      price.length === 0,
      availableQty.length === 0,
      userId.length === 0)
    ) {
      res.status(404).json({
        status: 'error',
        message:
          'verify the properties names and their content'
      });
      return;
    }
    res.status(201).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.log(error);
  }
};
