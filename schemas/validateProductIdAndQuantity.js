const Joi = require('joi');

module.exports = Joi.object({
  productId: Joi.number().integer().positive().strict()
  .required()
  .messages({
    'any.required': '400|{{#label}} is required',
    'number.base': '422|{{#label}} must be a number',
    'number.integer': '422|{{#label}} must be an integer',
    'number.positive': '422|{{#label}} must be greater than or equal to 1',
  }),
  quantity: Joi.number().integer().positive().strict()
  .required()
  .messages({
    'any.required': '400|{{#label}} is required',
    'number.base': '422|{{#label}} must be a number',
    'number.integer': '422|{{#label}} must be an integer',
    'number.positive': '422|{{#label}} must be greater than or equal to 1',
  }),
});
