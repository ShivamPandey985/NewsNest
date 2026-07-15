const express = require('express');
const helmet = require('helmet');

const config = require('./config/services');
const corsMiddleware = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    version: config.apiVersion,
    timestamp: new Date().toISOString()
  });
});

app.use(apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
