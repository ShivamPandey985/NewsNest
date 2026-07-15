function validateQueryParam(paramName, { required = false } = {}) {
  return (req, res, next) => {
    const value = req.query[paramName];
    if (required && (!value || !value.trim())) {
      const error = new Error(`Query parameter "${paramName}" is required`);
      error.statusCode = 400;
      return next(error);
    }
    next();
  };
}

module.exports = { validateQueryParam };
