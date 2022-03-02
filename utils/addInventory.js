const ProductsService = require('../services/ProductsService');
const ProductsModel = require('../models/ProductsModel');

const addInventory = async (sales) => {
  sales.forEach(async ({ productId, quantity }) => {
    const product = await ProductsService.getById(productId);
    const newQuantity = product.data.quantity + quantity;

    await ProductsModel.updateQuantity({ productId, quantity: newQuantity });
  });
};

module.exports = { addInventory };