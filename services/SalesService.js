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

const create = async (arrOfData) => {
  const [{ insertId }] = await SalesModel.createSale();

  arrOfData.forEach(async ({ productId, quantity }) => {
    await SalesModel.createSalesProducts({ insertId, productId, quantity });
  });

  return {
    id: insertId,
    itemsSold: arrOfData,
  };
};

module.exports = {
  getAll,
  getById,
  create,
};