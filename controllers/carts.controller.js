const { Cart } = require("../models/carts.model");

exports.getAllCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({ where: { status: "active" } });

    if (cart.length === 0) {
      res.status(404).json({
        status: "error",
        message: "There are not carts created until.",
      });
      return;
    }
    res.status(201).json({
      status: "success",
      data: {
        cart
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCartById = async(req,res) => {
  try {
    const { id } = req.params
    const cart = await Cart.findOne({
      where: {id: id, status: 'active'}
    })

    if(!cart){
      res.status(404).json({
        status: 'error',
        message: 'The id delivered, was not found'
      })
      return
    }

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
  })

  } catch (error) {
    console.log(error);
  }
}

exports.createCart = async (req, res) => {
    try {
    const { userId, totalPrice } = req.body;
    
    if ( !userId || !totalPrice || totalPrice.length< 1 ) {
      res.status(404).json({
        status: "error",
        message: "verify the properties names and their content",
      });
      return;
    }

    const cart = await Cart.create({
      userId: userId,
      totalPrice: totalPrice
    });

    res.status(201).json({
      status: "success",
      data: {
        cart
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params
    const cart = await Cart.findOne({
      where: {id: id, status: 'active'}
    })

    if(!cart){
      res.status(404).json({
        status: 'error',
        message: `The selected id ${id} was not found, please verify it.`
      })
      return
    }

    await cart.update({ status: 'deleted' })
    res.status(200).json({
      status: 'success',
      message: `The selected id ${id} was deleted.`,
      data: {
        cart
      }

    })

  } catch (error) {
    console.log(error);
  }
}

exports.deleteCartWithOutId = async (req, res) => {
  try {
    res.status(404).json({
      status: 'error',
      message: 'There are not was selected a valid ID, please add it'
    })
  } catch (error) {
    console.log(error);
  }
}