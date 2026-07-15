function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  console.error(`[api-gateway] Error: ${err.message}`);
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
}

module.exports = errorHandler;
