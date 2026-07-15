const axios = require('axios');
const env = require('../config/env');

/**
 * Talks to category-service to resolve interest ids into search keywords.
 * Keeps news-service decoupled from the category JSON data (true microservice
 * boundary - no shared filesystem/database between services).
 */
async function getKeywordsForInterests(interests = []) {
  if (!interests.length) return [];

  try {
    const response = await axios.get(`${env.categoryServiceUrl}/categories/keywords`, {
      params: { interests: interests.join(',') },
      timeout: 5000
    });
    return response.data.keywords || [];
  } catch (err) {
    console.error(`[news-service] Failed to reach category-service: ${err.message}`);
    return interests; // graceful fallback: use raw interest names as keywords
  }
}

module.exports = { getKeywordsForInterests };
