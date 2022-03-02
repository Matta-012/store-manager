const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().min(5).required().messages({
    'any.required': '400|{{#label}} is required',
    'string.base': '422|{{#label}} is must be a string',
    'string.min': '422|{{#label}} length must be at least 5 characters long',
  }),
  quantity: Joi.number().integer().positive().strict()
  .required()
  .messages({
    'any.required': '400|{{#label}} is required',
    'number.base': '422|{{#label}} must be a number',
    'number.integer': '422|{{#label}} must an integer',
    'number.positive': '422|{{#label}} must be greater than or equal to 1',
  }),
});
