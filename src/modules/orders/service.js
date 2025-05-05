const User = require("../users/model");
const Form8843 = require("../form/model");
const { Op } = require("sequelize");
const CryptoJS = require("crypto-js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Orders = require("./model"); // Assuming you have a model for form8843_data

exports.createOrder = async (userData) => {
    try {
      const { amount, userId } = userData;

      userData.orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
  
      var data = await Orders.create(userData);
  
      return data
  
    } catch (error) {
      throw new Error(error.message || "An error occurred while creating order.");
    }
  };

  exports.fetchOrders = async () => {
    try {
  
      // Check if the user exists
      Orders.belongsTo(User, { foreignKey: "userId", targetKey: "userId",});
      Orders.belongsTo(Form8843, { foreignKey: "userId", targetKey: "userId",});

    const existingOrders = await Orders.findAll({
      include: [
        {
            model: User,
            attributes: { exclude: ["id", "password", "token", "createdAt", "updatedAt", "deletedAt"] }, // Exclude sensitive information
        },
        {
            model: Form8843,
            attributes: { exclude: ["id", "createdAt", "updatedAt"] }, // Exclude sensitive information
        },
      ],
      order: [["createdAt", "DESC"]], // Fetch data in descending order based on creation date
    });

      return existingOrders;
  
    } catch (error) {
      throw new Error(error.message || "An error occurred during fetching all orders.");
    }
  };

//   const orders = await Orders.findAll({
//     where: { userId },
//     attributes: { exclude: ["id", "updatedAt"] }, // Exclude sensitive information
//     include: [
//       {
//         model: User,
//         as: "user",
//         attributes: { exclude: ["id", "userId", "createdAt", "updatedAt"] }
//       },
//     ],
//   });

  exports.fetchOrdersById = async (userData) => {
    try {
      // Validate required fields
      const { userId } = userData;
  
      // Check if the user exists
    const orders = await Orders.findAll({
      where: { userId },
      attributes: { exclude: ["id", "updatedAt"] }, // Exclude sensitive information
    });
  
      return orders;
    } catch (error) {
      throw new Error(error.message || "An error occurred during get orders by ID.");
    }
  };

  exports.updateOrderStatus = async (orderData) => {
    try {
      const { id } = orderData;
      
      var data = await Orders.update(orderData, {
        where: { id: id }
      });
  
      return data
  
    } catch (error) {
      throw new Error(error.message || "An error occurred while updating order status.");
    }
  };