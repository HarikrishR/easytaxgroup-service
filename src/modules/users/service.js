const User = require("./model");
const UsdotApplication = require("./us_model");
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
  console.log(userData);
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


exports.createUsdotapplication = async (userData) => {
  try {
    const {
      firstName,
      lastName,
      businessName,
      email,
      areaCode,
      phoneNumber,
      serviceOffered,
      typeOfProperty,
      numberOfVehicles,
      typeOfVehicle,
      ownershipOfVehicle,
      interstateIntrastate,
      // userId,
      driversLicenseFileName,
      businessLicenseFileName,
    } = userData;

    // Check if application already exists for this user
    
    // const existingApplication = await UsdotApplication.findOne({
    //   where: { userId },
    // });

    // if (existingApplication) {
    //   throw new Error("USDOT application already exists for this user.");
    // }

    // --- FIX START: Safely parse typeOfProperty if it's a string ---
    let parsedTypeOfProperty = typeOfProperty;

    if (typeof typeOfProperty === 'string') {
        try {
            // Attempt to parse the incoming string (e.g., "[\"Item1\",\"Item2\"]")
            const tempParsed = JSON.parse(typeOfProperty);
            
            // If parsing results in a valid object/array, use it. Otherwise, use the original string as a single item.
            parsedTypeOfProperty = Array.isArray(tempParsed) || (typeof tempParsed === 'object' && tempParsed !== null) ? tempParsed : typeOfProperty;
        } catch (e) {
            // If parsing fails, use the raw string value (e.g., if it was just "Hazardous Materials")
            parsedTypeOfProperty = typeOfProperty;
        }
    }
    // --- FIX END ---

    // Create the USDOT application
    const applicationData = {
      // userId,
      firstName,
      lastName,
      businessName,
      email,
      areaCode,
      phoneNumber,
      serviceOffered,
      typeOfProperty: JSON.stringify(typeOfProperty), // Store as JSON string
      numberOfVehicles,
      typeOfVehicle,
      ownershipOfVehicle,
      interstateIntrastate,
      driversLicenseFileName,
      businessLicenseFileName,
    };

    const newApplication = await UsdotApplication.create(applicationData);
    return newApplication;
  } catch (error) {
    console.error("Error during USDOT application creation:", error.message);
    throw new Error(error.message || "An error occurred during USDOT application creation.");
  }
};

exports.fetchUsdotapplications = async (query) => { // <-- ACCEPT QUERY
  try {
    const { page = 1, limit = 10, search = '' } = query; // <-- DESTRUCTURE & SET DEFAULTS
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      const searchLike = `%${search}%`;
      // Use Op.or to search across multiple fields (e.g., businessName, email, name fields)
      where[Op.or] = [
        // { businessName: { [Op.iLike]: searchLike } },
        { email: { [Op.iLike]: searchLike } },
        { firstName: { [Op.iLike]: searchLike } },
        { lastName: { [Op.iLike]: searchLike } },
        { phoneNumber: { [Op.iLike]: searchLike } },
        // { serviceOffered: { [Op.iLike]: searchLike } },
      ];
    }

    // Use findAll and count to get both paginated data and total count
    const result = await UsdotApplication.findAndCountAll({
      where, // <-- APPLY SEARCH FILTER
      limit: parseInt(limit, 10), // <-- APPLY LIMIT
      offset: parseInt(offset, 10), // <-- APPLY OFFSET
      order: [['createdAt', 'DESC']],
    });

    // Return the rows (data) and the total count
    return {
      data: result.rows,
      totalCount: result.count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(result.count / limit),
    };

  } catch (error) {
    console.error("Error during fetching USDOT applications:", error.message);
    throw new Error(error.message || "An error occurred during fetching USDOT applications.");
  }
};


exports.updateUser = async (data, filter) => {
  const result = await User.update(data, filter);
  return result;
};