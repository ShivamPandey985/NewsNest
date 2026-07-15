const express = require('express');
const config = require('../config/services');
const newsRoutes = require('./news.routes');
const categoryRoutes = require('./category.routes');

const router = express.Router();
const prefix = `/api/${config.apiVersion}`;

router.use(`${prefix}/news`, newsRoutes);
router.use(`${prefix}/categories`, categoryRoutes);

module.exports = router;
