const { ProductsInCart } = require("../models/productsInCart.model");

exports.getAllproductInCart = async (req, res) => {
  try {
    const productsInCart = await ProductsInCart.findAll({ where: { status: "active" } });

    if (productsInCart.length === 0) {
      res.status(200).json({
        status: "success",
        message: "There are not productInCart created until.",
      });
      return;
    }
    res.status(201).json({
      status: "success",
      data: {
        productsInCart,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProductsInCartById = async (req, res) => {
  try {
    const { id } = req.params
    const productInCart = await ProductsInCart.findOne({
      where: {id: id, status: 'active'}
    })

    if(!productInCart){
      res.status(404).json({
        status: 'error',
        message: `The selected Id ${id} was not found, please verify it.`
      })
      return
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        productInCart
      }
    })
  } catch (error) {
    console.log(error);
  }
}

exports.createProductInCart = async (req, res) => {
    try {
    const { cartId, productId, quantity, price } = req.body;
          
    if ( 
      !cartId || !productId || !quantity || !price || 
      cartId < 1 ||
      productId < 1 ||
      quantity < 1 ||
      price.length < 1 
    ) {
      res.status(404).json({
        status: "error",
        message: "verify the properties names and their values",
      });
      return;
    }
    
    const productInCart = await ProductsInCart.create({
      cartId: cartId, 
      productId: productId,
      quantity: quantity, 
      price: price
  });

    res.status(201).json({
      status: "success",
      data: {
        productInCart
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProductInCart = async (req, res) => {
  try {
    const { id } = req.params
    const productInCart = await ProductsInCart.findOne({
      where: {id: id, status: 'active'}
    })

    if(!productInCart){
      res.status(404).json({
        status: 'error',
      message: `The selected Id ${id} was not found, please verify it.`
      })
      return
    }
    await productInCart.update({status: 'deleted'})
    res.status(200).json({
      status:'success',
      message: `The selected id ${id} was deleted.`
    })

  } catch (error) {
    console.log(error);
  }
}

exports.deleteProductInCartWithoutId = async (req, res) => {
  try {
    res.status(404).json({
      status: 'error',
      message: 'There are not was selected a valid ID, please add it'
    })
  } catch (error) {
    console.log(error);
  }
}