const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/db");

const BusinessRegistrationApplication = sequelize.define(
  "BusinessRegistrationApplication",
  {
    applicationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddressLineOne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddressLineTwo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddressCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddressState: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddressZip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ssn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secoundaryFirstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secoundaryLastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secoundaryEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secoundaryPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secoundarySSN: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primaryDiversLicenseFileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondaryDiversLicenseFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "working", "approved", "rejected"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "business_reg_applications",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = BusinessRegistrationApplication;
