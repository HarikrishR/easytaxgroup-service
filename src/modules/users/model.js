const { DataTypes } = require("sequelize");
const CryptoJS = require("crypto-js");
const sequelize = require("../../utils/db"); // Import the database connection
const { validatePayload } = require("../../utils");
const userJoiSchema = require("./joiSchema");

const User = sequelize.define(
  "user",
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(["Male", "Female", "Other"]),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    hooks: {
      // Hook to hash the password before creating, save the user
      beforeSave: (instance, options) => {
        try {
          if (instance._changed.has("password"))
            instance.password = User.hashPassword(instance.password);

          // validate payload
          if (instance._options.isNewRecord) {
            validatePayload(instance.dataValues, userJoiSchema.create);
          } else {
            const payload = {};
            options.fields.forEach((field) => {
              payload[field] = instance.get(field);
            });
            validatePayload(payload, userJoiSchema.update);
          }
        } catch (error) {
          throw new Error(`Validation failed: ${error.message}`);
        }
      },
    },
  }
);

// < ========== Static & Instance methods ========== >
User.hashPassword = function (password) {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
};

User.verifyPassword = function (inputPassword, hashedPassword) {
  const hashedInputPassword = CryptoJS.SHA256(inputPassword).toString(
    CryptoJS.enc.Hex
  );
  return hashedInputPassword === hashedPassword;
};

User.prototype.getEmail = function () {
  return this.email.toLowerCase();
};

module.exports = User;
