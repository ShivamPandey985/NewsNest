const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
// An explicitly empty string means "same-origin, routed via Ingress" (used in Kubernetes).
// An unset variable falls back to a sensible local default (used in Docker Compose / local dev).
const API_GATEWAY_URL = process.env.API_GATEWAY_URL !== undefined
  ? process.env.API_GATEWAY_URL
  : 'http://localhost:4000';

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'frontend', timestamp: new Date().toISOString() });
});

// Injects runtime config (API Gateway URL) into the browser without a build step.
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  const base = `${API_GATEWAY_URL}/api/v1`;
  res.send(`window.__NEWSNEST_CONFIG__ = { API_BASE_URL: "${base}" };`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const server = app.listen(PORT, () => {
  console.log(`[frontend] running on port ${PORT}`);
  console.log(`[frontend] pointing to API Gateway: ${API_GATEWAY_URL}`);
});

process.on('SIGTERM', () => {
  console.log('[frontend] SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[frontend] SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
