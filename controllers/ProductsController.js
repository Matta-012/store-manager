const ProductsService = require('../services/ProductsService');

const getAll = async (_req, res) => {
  const serviceResponse = await ProductsService.getAll();

  return res.status(200).json(serviceResponse);
};

module.exports = {
  getAll,
};