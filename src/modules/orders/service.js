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

  exports.fetchOrders = async (query) => {
    try {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            const searchLike = `%${search}%`;
            where[Op.or] = [
                // Change 'User' to 'user' if that is your model name
                { '$user.email$': { [Op.iLike]: searchLike } },
                { '$user.firstName$': { [Op.iLike]: searchLike } },
                { '$user.lastName$': { [Op.iLike]: searchLike } },
                { '$user.phoneNumber$': { [Op.iLike]: searchLike } },
                { orderId: { [Op.iLike]: searchLike } } 
            ];
        }

        // Define associations (Ideally these should be in your models/index.js)
        Orders.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });
        Orders.belongsTo(Form8843, { foreignKey: "userId", targetKey: "userId" });

        const existingOrders = await Orders.findAndCountAll({
            include: [
                {
                    model: User,
                    // Ensure the model name here matches the name in your '$User.email$' string
                    attributes: { exclude: ["id", "password", "token", "createdAt", "updatedAt", "deletedAt"] },
                },
                {
                    model: Form8843,
                    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
                },
            ],
            where, 
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [["createdAt", "DESC"]],
            // subQuery: false is often required when filtering on included models with limit/offset
            subQuery: false, 
        });

        return {
            data: existingOrders.rows,
            totalCount: existingOrders.count,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(existingOrders.count / limit),
        };

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
      order: [["createdAt", "DESC"]]
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