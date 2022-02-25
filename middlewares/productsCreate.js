const productsCreate = require('../schemas/productsCreate');

module.exports = async (req, res, next) => {
  const { name, quantity } = req.body;

  const { error } = productsCreate.validate({ name, quantity });

  if (error) {
    const [code, message] = error.message.split('|');
    console.error({ code, message });

    return res.status(code).json({ message });
  }

  next();
};