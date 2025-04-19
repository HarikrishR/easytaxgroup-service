const service = require("./service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      console.log(paymentIntent);

      res.json({client_secret: paymentIntent.client_secret, amount : paymentIntent.amount, currency: paymentIntent.currency});
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};