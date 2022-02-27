const ProductsService = require('../services/ProductsService');

module.exports = async (sales) => {
  const validation = {
    productError: {},
    quantityError: {},
    products: [],
  };

  await Promise.all(
    sales.map(async ({ productId, quantity }) => {
      const product = await ProductsService.getById(productId);

      validation.products.push(product.data);
  
      if (product.message) validation.productError = product;
  
      if (product.data.quantity - quantity < 0) {
        validation.quantityError = { code: 422, message: 'Such amount is not permitted to sell' };
      }
    }),
  );

  return validation;
};