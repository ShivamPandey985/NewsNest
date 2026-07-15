const axios = require('axios');
const env = require('../config/env');
const cache = require('./cache.service');
const { normalizeArticles } = require('../utils/normalize');

const client = axios.create({
  baseURL: env.newsApiBaseUrl,
  timeout: 8000,
  headers: {
    'X-Api-Key': env.newsApiKey
  }
});

function buildCacheKey(endpoint, params) {
  return `${endpoint}?${JSON.stringify(params)}`;
}

/**
 * Generic fetch helper with 5-minute in-memory caching.
 * This is the ONLY place in the entire system that talks to the
 * external News API. The API key never leaves this service.
 */
async function fetchFromNewsApi(endpoint, params = {}) {
  const cacheKey = buildCacheKey(endpoint, params);
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  if (!env.newsApiKey) {
    const error = new Error('News API key is not configured on the server');
    error.statusCode = 500;
    throw error;
  }

  try {
    const response = await client.get(endpoint, { params });
    const articles = normalizeArticles(response.data.articles || []);
    const result = {
      totalResults: response.data.totalResults || articles.length,
      articles
    };
    cache.set(cacheKey, result);
    return { ...result, fromCache: false };
  } catch (err) {
    const status = err.response ? err.response.status : 502;
    const message = err.response && err.response.data && err.response.data.message
      ? err.response.data.message
      : 'Failed to fetch data from the News API';
    const error = new Error(message);
    error.statusCode = status >= 400 && status < 600 ? status : 502;
    throw error;
  }
}

function getTopHeadlines({ country = 'us', category, pageSize = 20, page = 1 } = {}) {
  return fetchFromNewsApi('/top-headlines', { country, category, pageSize, page });
}

function getEverything({ q, sortBy = 'publishedAt', pageSize = 20, page = 1, from, to } = {}) {
  return fetchFromNewsApi('/everything', { q, sortBy, pageSize, page, from, to });
}

module.exports = { getTopHeadlines, getEverything };
