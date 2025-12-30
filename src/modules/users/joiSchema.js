const Joi = require("joi");

module.exports = {
  create: Joi.object().keys({
    id: Joi.number().allow(null),
    userId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female", "Other"),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
  }),

  update: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    gender: Joi.string().valid("Male", "Female", "Other"),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
  }),
};

exports.createUsdotApplicationSchema = Joi.object({
  userId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  businessName: Joi.string().required(),
  email: Joi.string().email().required(),
  areaCode: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  serviceOffered: Joi.string().required(),
  typeOfProperty: Joi.array().items(Joi.string()),
  numberOfVehicles: Joi.number().required(),
  typeOfVehicle: Joi.string().required(),
  ownershipOfVehicle: Joi.string().required(),
  interstateIntrastate: Joi.string().required(),
  driversLicenseFileName: Joi.string(),
  businessLicenseFileName: Joi.string(),
});

exports.businessRegistrationSchema = Joi.object({
  businessName: Joi.string().required(),
  userId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  areaCode: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  serviceOffered: Joi.string().required(),
  typeOfProperty: Joi.array().items(Joi.string()),
  numberOfVehicles: Joi.number().required(),
  typeOfVehicle: Joi.string().required(),
  ownershipOfVehicle: Joi.string().required(),
  interstateIntrastate: Joi.string().required(),
  driversLicenseFileName: Joi.string(),
  businessLicenseFileName: Joi.string(),
});


exports.formF1VisaRegistrationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  visaStatus: Joi.string().required(),
  stateOfResidency: Joi.string().required(),
  referalName: Joi.string().required(),
  referalPhoneNumber: Joi.string().required(),
});