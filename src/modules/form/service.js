const User = require("../users/model");
const { Op } = require("sequelize");
const Form8843 = require("./model"); // Assuming you have a model for form8843_data


exports.updateForm = async (userData) => {
  try { 
    // Validate required fields
    const { userId } = userData;

    // Check if the user exists
    const existingUser = await Form8843.findOne({
      where: { userId },
    });

    if (!existingUser) {
      await Form8843.create(userData);
    }
    else {
      await Form8843.update(userData, {
      where: { userId },
      });
    }

    await User.update(userData, {
      where: { userId },
    });
    
    return "Updated successfully";
  } catch (error) {
    throw new Error(error.message || "An error occurred during updating form 8843.");
  }
};

exports.fetchFromById = async (userData) => {
  try {
    // Validate required fields
    const { userId } = userData;

    Form8843.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });

    // Check if the user exists
    const existingUser = await Form8843.findOne({
      where: { userId },
      include: [
      {
        model: User,
        attributes: { exclude: ["password", "userId", "id", "address", "usaAddress", "gender", "createdAt", "token", "deletedAt", "updatedAt"] }, // Exclude sensitive information
      },
      ],
    });

    if (!existingUser) {
      return {};
    }

    // Return the user details (excluding sensitive information like password)
    const data = existingUser.toJSON();
    return data;
  } catch (error) {
    throw new Error(error.message || "An error occurred while fetching form8843 by ID.");
  }
};