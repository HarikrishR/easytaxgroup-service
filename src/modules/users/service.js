const User = require("./model");
const { Op } = require("sequelize");
const CryptoJS = require("crypto-js");

exports.getUsers = (query) => {
  //   -> add pagination
  const { page = 1, limit = 10 } = query;
  const offset = (page - 1) * limit;

  // -> filter by gender
  const filter = {};
  const { gender } = query;
  if (gender) filter.gender = gender;

  // -> implement other business logics if any

  return User.findAll({
    where: filter,
    limit,
    offset,
    order: [["name", "ASC"]],
  });
};

exports.createUser = async (userData) => {
  try {
    // Validate required fields
    const { email, phoneNumber } = userData;

    // Check if the user with the same email or name already exists
    const existingUser = await User.findOne({
      where: {
      [Op.or]: [{ email }, { phoneNumber}],
      }
    });
    if (existingUser) {
      throw new Error("Email or phoneNumber already exists.");
    }

    // Create the user
    // Generate a token for the user
    const token = CryptoJS.SHA256(userData.email + Date.now().toString()).toString();

    // Add the token to the user data
    userData.token = token;

    userData.userId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create the user
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error("Error during user signup:", error.message);
    throw new Error(error.message || "An error occurred during user signup.");
  }
};

exports.signInUser = async (userData) => {
  try {
    // Validate required fields
    const { email, password } = userData;

    // Check if the user exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (!existingUser) {
      throw new Error("Email not exists.");
    }

    // Compare the provided password with the stored hashed password
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const isPasswordValid = hashedPassword === existingUser.password;

    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }

    // Return the user details (excluding sensitive information like password)
    const { password: _, ...userWithoutPassword } = existingUser.toJSON();
    return userWithoutPassword;
  } catch (error) {
    console.error("Error during user sign-in:", error.message);
    throw new Error(error.message || "An error occurred during user sign-in.");
  }
};

exports.fetchUserById = async (userData) => {
  try {
    // Validate required fields
    const { userId } = userData;

    // Check if the user exists
    const existingUser = await User.findOne({
      where: { userId },
    });

    if (!existingUser) {
      throw new Error("User not exists.");
    }

    // Return the user details (excluding sensitive information like password)
    const { password: _, ...userWithoutPassword } = existingUser.toJSON();
    return userWithoutPassword;
  } catch (error) {
    throw new Error(error.message || "An error occurred during get users by ID.");
  }
};

exports.fetchUsers = async () => {
  try {

    // Check if the user exists
    const existingUsers = await User.findAll({
      where: {
      type: {
        [Op.ne]: "ADMIN",
      },
      },
    });
    return existingUsers.map(user => {
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    });

  } catch (error) {
    throw new Error(error.message || "An error occurred during fetch users.");
  }
};

exports.updateUser = async (data, filter) => {
  const result = await User.update(data, filter);
  return result;
};