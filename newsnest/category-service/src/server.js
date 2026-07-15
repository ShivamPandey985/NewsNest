const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`[category-service] running on port ${env.port} (${env.nodeEnv})`);
});

process.on('SIGTERM', () => {
  console.log('[category-service] SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[category-service] SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
