const validateProductIdAndQuantity = require('../schemas/validateProductIdAndQuantity');

module.exports = async (req, res, next) => {
  let validation;

  req.body.forEach(({ productId, quantity }) => {
    validation = validateProductIdAndQuantity.validate({ productId, quantity });
  });

  const { error } = validation;

  if (error) {
    const [code, message] = error.message.split('|');
    console.error({ code, message });

    return res.status(code).json({ message });
  }

  next();
};
