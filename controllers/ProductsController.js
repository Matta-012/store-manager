const ProductsService = require('../services/ProductsService');

const getAll = async (_req, res) => {
  const result = await ProductsService.getAll();

  if (result.message) return res.status(result.code).json(result.message);

  return res.status(result.code).json(result.data);
};

module.exports = {
  getAll,
};