const service = require("./service");

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const userData = req.body;
    const data = await service.createTransaction(userData);

    res.status(200).json({
      status: "success",
      message: "Transaction created successfully!",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const userData = req.body;
    const data = await service.updateTransaction(userData);

    res.status(200).json({
      status: "success",
      message: "Transaction created successfully!",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};