const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const { validateNameAndQuantity } = require('../middlewares');

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
  validateNameAndQuantity,
  ProductsController.create,
);

router.put(
  '/:id',
  validateNameAndQuantity,
  ProductsController.update,
);

module.exports = router;
