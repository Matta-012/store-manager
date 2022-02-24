const ProductsService = require('../services/ProductsService');

const getAll = async (_req, res) => {
  const result = await ProductsService.getAll();

  if (result.message) return res.status(result.code).json({ message: result.message });

  return res.status(result.code).json(result.data);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const result = await ProductsService.getById(Number(id));

  if (result.message) return res.status(result.code).json({ message: result.message });

  return res.status(result.code).json(result.data);
};

module.exports = {
  getAll,
  getById,
};