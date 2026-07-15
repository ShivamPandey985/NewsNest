const axios = require('axios');

/**
 * Forwards a GET request to an internal microservice and relays the
 * response (or error) back through Express, normalizing failures so the
 * frontend always receives a consistent { success, error } shape.
 */
function forwardGet(baseUrl) {
  return async (req, res, next) => {
    try {
      const targetPath = req.params[0] ? `/${req.params[0]}` : '';
      const response = await axios.get(`${baseUrl}${targetPath}`, {
        params: req.query,
        timeout: 10000
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).json(
          err.response.data || { success: false, error: { message: 'Upstream service error' } }
        );
      }
      const error = new Error(`Upstream service unreachable: ${err.message}`);
      error.statusCode = 502;
      next(error);
    }
  };
}

module.exports = { forwardGet };
