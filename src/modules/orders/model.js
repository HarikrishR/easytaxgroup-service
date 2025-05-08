// filepath: /Users/harikrishnanr/Documents/freelance/easyTaxGroupService/easytaxgroup-service/src/modules/users/form8843Model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/db"); // Import the database connection

const Orders = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    form: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    submittedYear: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
    },
    trackingLink: {
        type: DataTypes.STRING(5000),
        allowNull: true,
    },
    trackingNumber: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    paymentStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    noOfDaysUSA: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Orders;