const SalesService = require('../services/SalesService');

const getAll = async (_req, res) => {
  const result = await SalesService.getAll();

  if (result.message) return res.status(result.code).json({ message: result.message });

  return res.status(result.code).json(result.data);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const result = await SalesService.getById(Number(id));

  if (result.message) return res.status(result.code).json({ message: result.message });

  return res.status(result.code).json(result.data);
};

const create = async (req, res) => {
  if (!req.body.length) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const serviceResponse = await SalesService.create(req.body);

  if (serviceResponse.message) {
    return res.status(serviceResponse.code).json({ message: serviceResponse.message });
  }

  return res.status(serviceResponse.code).json(serviceResponse.data);
};

const update = async (req, res) => {
  const { id } = req.params;

  if (!req.body.length) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const { productId, quantity } = req.body[0];
  const serviceResponse = await SalesService.update({ id, productId, quantity });

  if (serviceResponse.message) {
    return res.status(serviceResponse.code).json({ message: serviceResponse.message });
  }

  return res.status(serviceResponse.code).json(serviceResponse.data);
};

const deleteSale = async (req, res) => {
  const { id } = req.params;

  const serviceResponse = await SalesService.deleteSale(Number(id));

  if (serviceResponse.message) {
    return res.status(serviceResponse.code).json({ message: serviceResponse.message });
  }

  return res.status(serviceResponse.code).end();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteSale,
};