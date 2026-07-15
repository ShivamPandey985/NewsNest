const app = require('./app');
const config = require('./config/services');

const server = app.listen(config.port, () => {
  console.log(`[api-gateway] running on port ${config.port} (${config.nodeEnv})`);
  console.log(`[api-gateway] API base: /api/${config.apiVersion}`);
});

process.on('SIGTERM', () => {
  console.log('[api-gateway] SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[api-gateway] SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
