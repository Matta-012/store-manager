const ProductsModel = require('../models/ProductsModel');

const getAll = async () => {
  const result = await ProductsModel.getAll();

  if (result.length === 0) {
    return {
      code: 404,
      message: 'Products not found',
    };
  }

  return {
    code: 200,
    data: result,
  };
};

const getById = async (id) => {
  const result = await ProductsModel.getById(id);

  if (result.length === 0) {
    return {
      code: 404,
      message: 'Product not found',
    };
  }

  return {
    code: 200,
    data: result,
  };
};

module.exports = {
  getAll,
  getById,
};