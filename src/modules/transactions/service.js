const User = require("../users/model");
const { Op } = require("sequelize");
const CryptoJS = require("crypto-js");
const Transaction = require("./model"); // Assuming you have a model for form8843_data


exports.updateTransaction = async (userData) => {
  try { 
    // Validate required fields
    const { userId } = userData;

    // Check if the user exists
    const existingUser = await Transaction.findOne({
      where: { userId },
    });

    if (!existingUser) {
      await Transaction.create(userData);
    }
    else {
      await Transaction.update(userData, {
      where: { userId },
      });
    }

    await Transaction.update(userData, {
      where: { userId },
    });
    
    return "Updated successfully";
  } catch (error) {
    throw new Error(error.message || "An error occurred during updating form 8843.");
  }
};