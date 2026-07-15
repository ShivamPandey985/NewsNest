const cors = require('cors');
const config = require('../config/services');

module.exports = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, health checks, server-to-server)
    if (!origin || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
});
