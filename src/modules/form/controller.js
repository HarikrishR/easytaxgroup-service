const formServices = require("./service");

exports.updateForm = async (req, res, next) => {
  try {
    const userData = req.body;
    await formServices.updateForm(userData);

    res.status(200).json({
      status: "success",
      message: "Form 8843 updated successfully."
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};


exports.fetchFromById = async (req, res, next) => {
  try {
    const userData = req.body;
    var user = await formServices.fetchFromById(userData);

    res.status(200).json({
      status: "success",
      message: "Form 8843 found!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};