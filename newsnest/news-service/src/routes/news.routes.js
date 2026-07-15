const express = require('express');
const {
  getTrending,
  getLatest,
  searchArticles,
  getByInterests,
  getByCategory,
  getRelated,
  getArticleById
} = require('../controllers/news.controller');
const { validateQueryParam } = require('../middleware/validate');

const router = express.Router();

router.get('/trending', getTrending);
router.get('/latest', getLatest);
router.get('/search', validateQueryParam('q', { required: true }), searchArticles);
router.get('/by-interests', validateQueryParam('interests', { required: true }), getByInterests);
router.get('/by-category/:category', getByCategory);
router.get('/related', validateQueryParam('title', { required: true }), getRelated);
router.get('/article/:id', getArticleById);

module.exports = router;
