const express = require('express');
const SalesController = require('../controllers/SalesController');
const { validateProductIdAndQuantity } = require('../middlewares');

const router = express.Router();

router.get(
  '/',
  SalesController.getAll,
);

router.get(
  '/:id',
  SalesController.getById,
);

router.post(
  '/',
  validateProductIdAndQuantity,
  SalesController.create,
);

router.put(
  '/:id',
  validateProductIdAndQuantity,
  SalesController.update,
);

router.delete(
  '/:id',
  SalesController.deleteSale,
);

module.exports = router;
