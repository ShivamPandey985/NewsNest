const express = require('express');
const config = require('../config/services');
const { forwardGet } = require('../utils/proxy');

const router = express.Router();

// All paths under /api/v1/categories/* are forwarded to category-service's /categories/* routes
router.get('/*', forwardGet(`${config.categoryServiceUrl}/categories`));

module.exports = router;
