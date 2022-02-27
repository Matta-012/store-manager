const SalesModel = require('../models/SalesModel');
const ProductsModel = require('../models/ProductsModel');
const ProductsService = require('./ProductsService');
const addInventory = require('../utils/addInventory');
const validateProduct = require('../utils/validateProduct');

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
  /* 
    Validate if the products in the "sales" array exists
    and if the inventory quantity subtratected sale quantity is greater than 0
  */
  const { productError, quantityError, products } = await validateProduct(sales);

  if (productError.message || quantityError.message) {
    return quantityError.message ? quantityError : productError;
  }

  const saleId = await SalesModel.createSale();

  await Promise.all(
    sales.map(async ({ productId, quantity }, index) => {
      const newQuantity = products[index].quantity - quantity;

      await ProductsModel.updateQuantity({ productId, quantity: newQuantity });
      await SalesModel.createSalesProducts({ saleId, productId, quantity });
    }),
  );

  return { code: 201, data: { id: saleId, itemsSold: sales } };
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

const deleteSale = async (id) => {
  const getSalesById = await getById(id);

  if (getSalesById.message) return getSalesById;

  await addInventory(getSalesById.data);

  const result = await SalesModel.deleteSale(id);

  if (!result) {
    return {
      code: 404,
      message: 'Sale not found',
    };
  }

  return {
    code: 204,
  };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteSale,
};