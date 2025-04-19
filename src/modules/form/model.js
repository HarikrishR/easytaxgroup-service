// filepath: /Users/harikrishnanr/Documents/freelance/easyTaxGroupService/easytaxgroup-service/src/modules/users/form8843Model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/db"); // Import the database connection

const Form8843 = sequelize.define(
  "form8843_data",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    visaType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    citizen: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    wantToFile2021: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    wantToFile2022: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    wantToFile2023: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    wantToFile2024: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    passportNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    firstEntry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    universityName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    universityAdvisorName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    universityCity: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    universityStreet: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    universityZipcode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    universityAdvisorNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    universityState: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    noOfDaysUSA: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
    }
  },
  {
    tableName: "form8843_data",
    timestamps: true,
  }
);

module.exports = Form8843;