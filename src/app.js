const express = require("express"); // Create an express application
const cors = require("cors");
const rateLimit = require("express-rate-limit");

require("./utils/db");

const app = express();

const limiter = rateLimit({
  max: 1000,
  windowMS: 1000 * 60,
  message: "Too many requests",
});

// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(limiter);


const myRouter = require('./modules/index'); // Path to your router file
app.use('/api', myRouter);

// changes added from remote

module.exports = app;
