const productsModel = require('../models/productsModel');

const getAll = async () => {
  const modelResponse = await productsModel.getAll();

  return modelResponse;
};

module.exports = {
  getAll,
};