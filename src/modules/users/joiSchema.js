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
