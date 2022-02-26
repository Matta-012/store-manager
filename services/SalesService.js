const SalesModel = require('../models/SalesModel');

const getAll = async () => {
  const result = await SalesModel.getAll();

  if (result.length === 0) {
    return {
      code: 404,
      message: 'Sales not found',
    };
  }

  return {
    code: 200,
    data: result,
  };
};

const getById = async (id) => {
  const result = await SalesModel.getById(id);

  if (result.length === 0) {
    return {
      code: 404,
      message: 'Sale not found',
    };
  }

  return {
    code: 200,
    data: result,
  };
};

const create = async (sales) => {
  const saleId = await SalesModel.createSale();

  if (typeof saleId !== 'number') {
    return { code: 400, message: 'Bad request' };
  }

  sales.forEach(async ({ productId, quantity }) => {
    await SalesModel.createSalesProducts({ saleId, productId, quantity });
  });

  return {
    code: 201,
    data: {
      id: saleId,
      itemsSold: sales,
    },
  };
};

const update = async ({ id, productId, quantity }) => {
  const result = await SalesModel.update({ id, productId, quantity });

  if (!result) {
    return {
      code: 404,
      message: 'Sale not found',
    };
  }

  return {
    code: 200,
    data: {
      saleId: id,
      itemUpdated: [result],
    },
  };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
};