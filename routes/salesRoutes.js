const express = require('express');
const SalesController = require('../controllers/SalesController');

const router = express.Router();

router.get(
  '/',
  SalesController.getAll,
);

router.get(
  '/:id',
  SalesController.getById,
);

module.exports = router;
