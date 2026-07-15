require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4001,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:4000')
    .split(',')
    .map((origin) => origin.trim()),
  newsApiKey: process.env.NEWS_API_KEY || '',
  newsApiBaseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
  categoryServiceUrl: process.env.CATEGORY_SERVICE_URL || 'http://category-service:4002',
  cacheTtlMs: parseInt(process.env.CACHE_TTL_MS, 10) || 5 * 60 * 1000
};
