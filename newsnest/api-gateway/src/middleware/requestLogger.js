const morgan = require('morgan');
const config = require('../config/services');

module.exports = morgan(config.nodeEnv === 'production' ? 'combined' : 'dev');
