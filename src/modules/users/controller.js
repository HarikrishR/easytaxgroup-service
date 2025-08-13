const userService = require("./service");

exports.addUser = async (req, res, next) => {
  try {
    const userData = req.body;
    await userService.createUser(userData);

    res.status(200).json({
      status: "success",
      message: "User created successfully.",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.signInUser = async (req, res, next) => {
  try {
    const userData = req.body;
    var user = await userService.signInUser(userData);

    res.status(200).json({
      status: "success",
      message: "User found!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const userData = req.body;
    var user = await userService.forgotPassword(userData);

    res.status(200).json({
      status: "success",
      message: "User found!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const userData = req.body;
    var user = await userService.verifyOTP(userData);

    res.status(200).json({
      status: "success",
      message: "OTP Verified successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userData = req.body;
    var user = await userService.changePassword(userData);

    res.status(200).json({
      status: "success",
      message: "Password changed successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.fetchUserById = async (req, res, next) => {
  try {
    const userData = req.body;
    var user = await userService.fetchUserById(userData);

    res.status(200).json({
      status: "success",
      message: "User found!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.fetchUsers = async (req, res, next) => {
  try {
    var user = await userService.fetchUsers();

    res.status(200).json({
      status: "success",
      message: "User found!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.updateById = async (req, res, next) => {
  try {
    const affected = await userService.updateUser(req.body, {
      where: {
        id: req.params.id,
      },
      // returning: true, // PostgreSQL
      individualHooks: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        affected,
      },
    });
  } catch (error) {
    console.error(error);
  }
};