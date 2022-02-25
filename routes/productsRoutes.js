const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const { productsCreate } = require('../middlewares');

const router = express.Router();

router.get(
  '/',
  ProductsController.getAll,
);

router.get(
  '/:id',
  ProductsController.getById,
);

router.post(
  '/',
  productsCreate,
  ProductsController.create,
);

module.exports = router;
