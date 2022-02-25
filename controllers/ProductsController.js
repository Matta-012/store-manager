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

const create = async (req, res) => {
  const { name, quantity } = req.body;

  const serviceResponse = await ProductsService.create({ name, quantity });

  if (serviceResponse.message) {
    return res.status(serviceResponse.code).json({ message: serviceResponse.message });
  }

  return res.status(serviceResponse.code).json(serviceResponse.data);
};

module.exports = {
  getAll,
  getById,
  create,
};