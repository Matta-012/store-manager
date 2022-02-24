const ProductsModel = require('../models/ProductsModel');

const getAll = async () => {
  const modelResponse = await ProductsModel.getAll();

  return modelResponse;
};

const getById = async (id) => {
  const result = await ProductsModel.getById(id);

  return result;
};

module.exports = {
  getAll,
  getById,
};