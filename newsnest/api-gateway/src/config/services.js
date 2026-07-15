require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:8080')
    .split(',')
    .map((origin) => origin.trim()),
  newsServiceUrl: process.env.NEWS_SERVICE_URL || 'http://news-service:4001',
  categoryServiceUrl: process.env.CATEGORY_SERVICE_URL || 'http://category-service:4002',
  apiVersion: process.env.API_VERSION || 'v1'
};
