const { ProductsModel } = require('../models');

module.exports = async (id, quantity, salesQuantity) => {
  const product = await ProductsModel.getById(id);

  const productUpdate = {
    newQuantity: 0,
  };

  if (quantity <= salesQuantity) {
    productUpdate.newQuantity = salesQuantity - quantity + product.quantity;
  } else {
    productUpdate.newQuantity = product.quantity - (quantity - salesQuantity);

    if (productUpdate.newQuantity < 0) {
      productUpdate.code = 422;
      productUpdate.message = 'Such amount is not permitted to sell';
    }
  }

  return productUpdate;
};