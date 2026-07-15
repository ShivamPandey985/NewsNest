const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const newsRoutes = require('./routes/news.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.allowedOrigins,
    methods: ['GET', 'OPTIONS']
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many requests, please slow down.' } }
});
app.use(limiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'news-service',
    timestamp: new Date().toISOString()
  });
});

app.use('/news', newsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
