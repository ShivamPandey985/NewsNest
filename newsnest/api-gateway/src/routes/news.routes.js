const express = require('express');
const config = require('../config/services');
const { forwardGet } = require('../utils/proxy');

const router = express.Router();

// All paths under /api/v1/news/* are forwarded to news-service's /news/* routes
router.get('/*', forwardGet(`${config.newsServiceUrl}/news`));

module.exports = router;
