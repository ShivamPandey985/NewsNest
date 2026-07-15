const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  getKeywordsForInterests
} = require('../controllers/category.controller');

const router = express.Router();

router.get('/', getAllCategories);
router.get('/keywords', getKeywordsForInterests);
router.get('/:id', getCategoryById);

module.exports = router;
