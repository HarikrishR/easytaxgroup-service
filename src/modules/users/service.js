const User = require("./model");
const { Op } = require("sequelize");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const e = require("express");

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
      attributes: { exclude: ["firstName", "lastName","email", "phoneNumber", "id","ssn", "address", "street", "state", "city", "zipcode", "usaAddress", "usaStreet", "usaState", "usaCity", "usaZipcode", "gender", "createdAt", "deletedAt", "updatedAt"] }, // Exclude sensitive information
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

exports.forgotPassword = async (userData) => {
  try {
    // Validate required fields
    const { email } = userData;

    // Check if the user exists
    const existingUser = await User.findOne({
      where: { email },
      attributes: { exclude: ["firstName", "lastName","phoneNumber", "token", "password", "type", "userId","ssn", "address", "street", "state", "city", "zipcode", "usaAddress", "usaStreet", "usaState", "usaCity", "usaZipcode", "gender", "createdAt", "deletedAt", "updatedAt"] }, // Exclude sensitive information
    });

    if (!existingUser) {
      throw new Error("Email Address not exists.");
    } else {
      // Generate a random 4-digit code
      const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

      

      // Save the reset code in the database
      // Update the reset code and timestamp directly using the primary key
      const updateResult = await User.update(
        { fgtcode: resetCode.toString(), updatedAt: new Date() },
        { where: { email: existingUser.email } }
      );

      // Send the reset code via email using nodemailer
      const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harikrish12498@gmail.com", // Replace with your email
        pass: "xzhwoeqkpdzrnbta", // Replace with your email password or app password
      },
      });

      const mailOptions = {
      from: "harikrish12498@gmail.com", // Replace with your email
      to: email,
      subject: "Easy TAX Password Reset Code",
      text: `We received a request to reset your password. Use the code below to proceed: **Reset Code:** ${resetCode} This code will expire in 15 minutes. If you didn’t request a password reset, please ignore this email.`,
      };

      await transporter.sendMail(mailOptions);
    }

    return existingUser;

  } catch (error) {
    console.error("Error during forgot password:", error.message);
    throw new Error(error.message || "An error occurred during forgot password.");
  }
  // Check if the user exists
}

exports.verifyOTP = async (userData) => {
  try {
    // Validate required fields
    const { otp, password } = userData;

    // Check if the user exists and fetch the reset code and updatedAt timestamp
    const existingUser = await User.findOne({
      where: { fgtcode: otp },
      attributes: ["fgtcode", "updatedAt", "email"],
    });

    if (!existingUser) {
      throw new Error("Invalid OTP or email.");
    }

    // Check if the reset code has expired (15 minutes limit)
    const currentTime = new Date();
    const updatedAt = new Date(existingUser.updatedAt);
    const timeDifference = (currentTime - updatedAt) / (1000 * 60); // Difference in minutes

    if (timeDifference > 15) {
      throw new Error("Reset code has expired.");
    }

    console.log(existingUser);

    const updateResult = await User.update(
      { fgtcode: null, updatedAt: new Date()},
      { where: { email: existingUser.email } }
    );

    return existingUser.email;
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    throw new Error(error.message || "An error occurred during OTP verification.");
  }
};

exports.changePassword = async (userData) => {
  try {
    // Validate required fields
    const { email, password } = userData;

    // Check if the user exists and fetch the reset code and updatedAt timestamp
    const existingUser = await User.findOne({
      where: { email: email },
      attributes: ["email"],
    });

    const hashedPassword = CryptoJS.SHA256(password).toString(); // Hash the new password
    const updateResult = await User.update(
      { password: hashedPassword, updatedAt: new Date() },
      { where: { email: existingUser.email } }
    );

    return "Password changed successfully.";
  } catch (error) {
    console.error("Error during Password change:", error);
    throw new Error(error.message || "An error occurred during OTP verification.");
  }
};

exports.fetchUserById = async (userData) => {
  try {
    // Validate required fields
    const { userId } = userData;

    // Check if the user exists
    const existingUser = await User.findOne({
      where: { userId },
      attributes: { exclude: ["password", "id", "gender", "createdAt", "token", "deletedAt", "updatedAt"] }, // Exclude sensitive information
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