const ProductsModel = require('../models/ProductsModel');

const getAll = async () => {
  const modelResponse = await ProductsModel.getAll();

  return modelResponse;
};

module.exports = {
  getAll,
};