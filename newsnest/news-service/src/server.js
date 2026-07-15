const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`[news-service] running on port ${env.port} (${env.nodeEnv})`);
  if (!env.newsApiKey) {
    console.warn('[news-service] WARNING: NEWS_API_KEY is not set. Requests to the News API will fail.');
  }
});

process.on('SIGTERM', () => {
  console.log('[news-service] SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[news-service] SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
