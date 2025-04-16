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
