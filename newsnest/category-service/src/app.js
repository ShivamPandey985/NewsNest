const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const categoryRoutes = require('./routes/category.routes');
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

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'category-service',
    timestamp: new Date().toISOString()
  });
});

app.use('/categories', categoryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
