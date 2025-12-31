const User = require("./model");
const UsdotApplication = require("./us_model");
const BusinessRegistrationApplication = require("./businessReg_model");
const FormF1VisaRegistrationApplication = require("./formF1VisaReg_model");
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
        user: process.env.NODE_MAILER_AUTH_USER, // Replace with your email
        pass: process.env.NODE_MAILER_AUTH_PASS, // Replace with your email password or app password
      },
      });

      const mailOptions = {
      from: process.env.NODE_MAILER_AUTH_USER, // Replace with your email
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

    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_AUTH_USER, 
        pass: process.env.NODE_MAILER_AUTH_PASS, 
      },
    });

    await mailSender(transporter, process.env.NODE_MAILER_AUTH_USER, 'Easy TAX Group | US Dot Registration', `Hi Team, We have successfully reveived US Dot Application. from ${firstName} ${lastName} . Please check the admin panel for more details.`);
    
    await mailSender(transporter, email, 'Easy TAX Group | US Dot Registration', `Hi ${firstName} ${lastName}, We have successfully reveived US Dot Application. Our team will get back to you shortly. Thank you for choosing Easy TAX Group!`);

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

exports.updateUsDotAppStatus = async (applicationId, status) => {
  try {
    // 1. Create a date string in EST/EDT
    const estDate = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York"
    });
    
    const result = await UsdotApplication.update(
      { 
        status: status, 
        updatedAt: new Date(estDate) 
      }, 
      {
        where: {
          // Ensure this matches your model's primary key (applicationId or id)
          applicationId: applicationId 
        }
      }
    );

    if (result[0] === 0) {
      throw new Error("Application not found or status unchanged.");
    }

    return result;
  } catch (error) {
    console.error("Error updating Business Registration status:", error.message);
    throw new Error(error.message || "An error occurred during status update.");
  }
};

exports.createBusinessRegistrationApplication = async (userData) => {
  try {
    const {
      businessName,
      businessType,
      businessAddressLineOne,
      businessAddressLineTwo,
      businessAddressCity,
      businessAddressState,
      businessAddressZip,
      firstName,
      lastName,
      email,
      phoneNumber,
      ssn,
      secoundaryFirstName,
      secoundaryLastName,
      secoundaryEmail,
      secoundaryPhoneNumber,
      secoundarySSN,
      primaryDiversLicenseFileName,
      secondaryDiversLicenseFileName,
      } = userData;


    // Create the USDOT application
    const applicationData = {
      businessName,
      businessType,
      businessAddressLineOne,
      businessAddressLineTwo,
      businessAddressCity,
      businessAddressState,
      businessAddressZip,
      firstName,
      lastName,
      email,
      phoneNumber,
      ssn,
      secoundaryFirstName,
      secoundaryLastName,
      secoundaryEmail,
      secoundaryPhoneNumber,
      secoundarySSN,
      primaryDiversLicenseFileName,
      secondaryDiversLicenseFileName,
    };

    const newApplication = await BusinessRegistrationApplication.create(applicationData);

    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_AUTH_USER, 
        pass: process.env.NODE_MAILER_AUTH_PASS, 
      },
    });

    await mailSender(transporter, process.env.NODE_MAILER_AUTH_USER, 'Easy TAX Group | Business Registration', `Hi Team, We have successfully reveived Business Registration Application. from ${firstName} ${lastName} . Please check the admin panel for more details.`);
    
    await mailSender(transporter, email, 'Easy TAX Group | Business Registration', `Hi ${firstName} ${lastName}, We have successfully reveived Business Registration Application. Our team will get back to you shortly. Thank you for choosing Easy TAX Group!`);

    return newApplication;
  } catch (error) {
    console.error("Error during Business Registration application creation:", error.message);
    throw new Error(error.message || "An error occurred during Business Registration application creation.");
  }
};

exports.fetchBusinessRegistrationApplications = async (query) => { // <-- ACCEPT QUERY
  try {
    const { page = 1, limit = 10, search = '' } = query; // <-- DESTRUCTURE & SET DEFAULTS
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      const searchLike = `%${search}%`;
      where[Op.or] = [
        { email: { [Op.iLike]: searchLike } },
        { firstName: { [Op.iLike]: searchLike } },
        { lastName: { [Op.iLike]: searchLike } },
        { phoneNumber: { [Op.iLike]: searchLike } },
      ];
    }

    const result = await BusinessRegistrationApplication.findAndCountAll({
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
    console.error("Error during fetching Business Registration applications:", error.message);
    throw new Error(error.message || "An error occurred during fetching Business Registration applications.");
  }
};

exports.updateBusinessRegStatus = async (applicationId, status) => {
  try {
    // 1. Create a date string in EST/EDT
    const estDate = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York"
    });

    const result = await BusinessRegistrationApplication.update(
      { 
        status: status, 
        updatedAt: new Date(estDate) 
      }, 
      {
        where: {
          // Ensure this matches your model's primary key (applicationId or id)
          applicationId: applicationId 
        }
      }
    );

    if (result[0] === 0) {
      throw new Error("Application not found or status unchanged.");
    }

    return result;
  } catch (error) {

    console.error("Error updating Business Registration status:");
    console.error(error.message);
    throw new Error(error.message || "An error occurred during status update.");
  }
};

const mailSender = async (transporter, toEmail, subject, body) => {
  const mailOptions = {
    from: process.env.NODE_MAILER_AUTH_USER, 
    to: toEmail,
    subject: subject,
    text: body ,
  };

  await transporter.sendMail(mailOptions);
}

exports.createFormF1VisaRegApp = async (userData) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      visaStatus,
      stateOfResidency,
      referalName,
      referalPhoneNumber,
      } = userData;


    // Create the USDOT application
    const applicationData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      visaStatus,
      stateOfResidency,
      referalName,
      referalPhoneNumber,
    };

    const newApplication = await FormF1VisaRegistrationApplication.create(applicationData);

    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_AUTH_USER, 
        pass: process.env.NODE_MAILER_AUTH_PASS, 
      },
    });

    await mailSender(transporter, process.env.NODE_MAILER_AUTH_USER, 'Easy TAX Group | F1 Visa Registration', `Hi Team, We have successfully reveived F1 Visa Application. from ${firstName} ${lastName} . Please check the admin panel for more details.`);
    
    await mailSender(transporter, email, 'Easy TAX Group | F1 Visa Registration', `Hi ${firstName} ${lastName}, We have successfully reveived F1 Visa Application. Our team will get back to you shortly. Thank you for choosing Easy TAX Group!`);

    return newApplication;
  } catch (error) {
    console.error("Error during F1 Visa application creation:", error.message);
    throw new Error(error.message || "An error occurred during F1 Visa application creation.");
  }
};

exports.fetchFormF1VisaRegApp = async (query) => { // <-- ACCEPT QUERY
  try {
    const { page = 1, limit = 10, search = '' } = query; // <-- DESTRUCTURE & SET DEFAULTS
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      const searchLike = `%${search}%`;
      where[Op.or] = [
        { email: { [Op.iLike]: searchLike } },
        { firstName: { [Op.iLike]: searchLike } },
        { lastName: { [Op.iLike]: searchLike } },
        { phoneNumber: { [Op.iLike]: searchLike } },
      ];
    }

    const result = await FormF1VisaRegistrationApplication.findAndCountAll({
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
    console.error("Error during fetching Business Registration applications:", error.message);
    throw new Error(error.message || "An error occurred during fetching Business Registration applications.");
  }
};


exports.updateUser = async (data, filter) => {
  const result = await User.update(data, filter);
  return result;
};