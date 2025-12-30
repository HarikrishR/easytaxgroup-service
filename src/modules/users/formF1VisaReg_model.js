const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/db");

const FormF1VisaRegistrationApplication = sequelize.define(
  "FormF1VisaRegistrationApplication",
  {
    applicationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    visaStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stateOfResidency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referalPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "form_f1_visa_reg_applications",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = FormF1VisaRegistrationApplication;
