const bcryptjs = require('bcryptjs') 
const { User } = require("../models/users.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { status: "active" } });

    if (users.length === 0) {
      res.status(200).json({
        status: "success",
        message: "there are not users created until.",
      });
      return;
    }
    res.status(201).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = async (req, res) => {
    try {
    const { userName, email, password } = req.body;
    let passwordHash = await bcryptjs.hash(password, 8)
    const user = await User.create({
      userName: userName,
      email: email,
      password: passwordHash,
    });

    if (
      (!userName || !email || !password || userName.length === 0,
      email.length === 0,
      password.length === 0)
    ) {
      res.status(404).json({
        status: "error",
        message: "verify the properties names and their content",
      });
      return;
    }
    user.password = undefined
    res.status(201).json({
      status: "success",
      data: {
        user
      },
    });
  } catch (error) {
    console.log(error);
  }
};
