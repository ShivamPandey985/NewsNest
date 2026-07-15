const { estimateReadingTime } = require('./readingTime');

/**
 * Normalizes an article object coming from NewsAPI.org into a
 * consistent shape used throughout NewsNest.
 */
function normalizeArticle(raw, index = 0) {
  const id = Buffer.from(`${raw.url || ''}-${raw.publishedAt || ''}-${index}`).toString('base64url');

  return {
    id,
    title: raw.title || 'Untitled article',
    description: raw.description || '',
    content: raw.content || raw.description || '',
    url: raw.url || '',
    imageUrl: raw.urlToImage || null,
    source: raw.source && raw.source.name ? raw.source.name : 'Unknown source',
    author: raw.author || null,
    publishedAt: raw.publishedAt || null,
    readingTimeMinutes: estimateReadingTime(raw.content || raw.description || '')
  };
}

function normalizeArticles(rawArticles = []) {
  return rawArticles
    .filter((a) => a && a.title && a.title !== '[Removed]')
    .map((a, i) => normalizeArticle(a, i));
}

module.exports = { normalizeArticle, normalizeArticles };
