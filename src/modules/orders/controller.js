const service = require("./service");

exports.createOrder = async (req, res, next) => {
  try {
    const userData = req.body;
    const data = await service.createOrder(userData);

    res.status(200).json({
      status: "success",
      message: "Order created successfully!",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.fetchOrdersById = async (req, res, next) => {
  try {
    const userData = req.body;
    var user = await service.fetchOrdersById(userData);

    res.status(200).json({
      status: "success",
      message: "Orders found!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};