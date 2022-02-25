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

  if (!result) {
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

const create = async ({ name, quantity }) => {
  const isNewProduct = await ProductsModel.getByName(name);

  if (!isNewProduct) {
    return {
      code: 409,
      message: 'Product already exists',
    };
  }

  const result = await ProductsModel.create({ name, quantity });

  return {
    code: 201,
    data: result,
  };
};

module.exports = {
  getAll,
  getById,
  create,
};
