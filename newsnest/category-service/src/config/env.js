require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4002,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:4000')
    .split(',')
    .map((origin) => origin.trim())
};
