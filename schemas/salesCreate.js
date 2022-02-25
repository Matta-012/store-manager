const Joi = require('joi');

module.exports = Joi.object({
  productId: Joi.number().integer().positive().strict()
  .required()
  .messages({
    'any.required': '400|"productId" is required',
    'number.base': '422|"productId" must be a number',
    'number.integer': '422|"productId" must an integer',
    'number.positive': '422|"productId" must be greater than or equal to 1',
  }),
  quantity: Joi.number().integer().positive().strict()
  .required()
  .messages({
    'any.required': '400|"quantity" is required',
    'number.base': '422|"quantity" must be a number',
    'number.integer': '422|"quantity" must an integer',
    'number.positive': '422|"quantity" must be greater than or equal to 1',
  }),
});
