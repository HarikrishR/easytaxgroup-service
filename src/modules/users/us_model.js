const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/db");

const UsdotApplication = sequelize.define(
  "UsdotApplication",
  {
    applicationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    areaCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceOffered: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfProperty: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    numberOfVehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeOfVehicle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownershipOfVehicle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interstateIntrastate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driversLicenseFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessLicenseFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
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
    tableName: "usdot_applications",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = UsdotApplication;
