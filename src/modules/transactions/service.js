const User = require("../users/model");
const { Op } = require("sequelize");
const CryptoJS = require("crypto-js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Transaction = require("./model"); // Assuming you have a model for form8843_data


exports.createTransaction = async (userData) => {
  try {
    const { amount, userId } = userData;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: "usd",
      payment_method_types: ["card"],
    });
    console.log(paymentIntent);

    var transactionObj = {
      userId: userId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      liveMode: paymentIntent.livemode,
      createdAt: new Date(paymentIntent.created * 1000).toISOString()
    }

    var data = await Transaction.create(transactionObj);

    return data

  } catch (error) {
    throw new Error(error.message || "An error occurred while creating transaction.");
  }
};

exports.updateTransaction = async (userData) => {
  try {
    const { paymentId } = userData;
    
    var data = await Transaction.update(userData, {
      where: { paymentId: paymentId }
    });

    return data

  } catch (error) {
    throw new Error(error.message || "An error occurred while updating transaction.");
  }
};