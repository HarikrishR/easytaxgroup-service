// filepath: /Users/harikrishnanr/Documents/freelance/easyTaxGroupService/easytaxgroup-service/src/modules/users/form8843Model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/db"); // Import the database connection

const Transactions = sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    liveMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);

module.exports = Transactions;