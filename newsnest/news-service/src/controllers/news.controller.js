const newsApi = require('../services/newsApi.service');
const categoryClient = require('../services/categoryClient.service');
const cache = require('../services/cache.service');

function wrap(res, resultPromise) {
  return resultPromise
    .then((result) => {
      res.status(200).json({
        success: true,
        count: result.articles.length,
        totalResults: result.totalResults,
        cached: result.fromCache,
        data: result.articles
      });
    });
}

async function getTrending(req, res, next) {
  try {
    const { country = 'us', pageSize = 20, page = 1 } = req.query;
    const result = await newsApi.getTopHeadlines({ country, pageSize, page });
    await wrap(res, Promise.resolve(result));
  } catch (err) {
    next(err);
  }
}

async function getLatest(req, res, next) {
  try {
    const { q = 'news', pageSize = 20, page = 1 } = req.query;
    const result = await newsApi.getEverything({ q, sortBy: 'publishedAt', pageSize, page });
    await wrap(res, Promise.resolve(result));
  } catch (err) {
    next(err);
  }
}

async function searchArticles(req, res, next) {
  try {
    const { q, pageSize = 20, page = 1, from, to, sortBy = 'relevancy' } = req.query;
    if (!q) {
      const error = new Error('Query parameter "q" is required for search');
      error.statusCode = 400;
      throw error;
    }
    const result = await newsApi.getEverything({ q, sortBy, pageSize, page, from, to });
    await wrap(res, Promise.resolve(result));
  } catch (err) {
    next(err);
  }
}

async function getByInterests(req, res, next) {
  try {
    const { interests, pageSize = 20, page = 1 } = req.query;
    if (!interests) {
      const error = new Error('Query parameter "interests" is required (comma-separated)');
      error.statusCode = 400;
      throw error;
    }
    const interestList = interests.split(',').map((s) => s.trim().toLowerCase());
    const keywords = await categoryClient.getKeywordsForInterests(interestList);
    const query = keywords.length ? keywords.join(' OR ') : interestList.join(' OR ');
    const result = await newsApi.getEverything({ q: query, sortBy: 'publishedAt', pageSize, page });
    await wrap(res, Promise.resolve(result));
  } catch (err) {
    next(err);
  }
}

async function getByCategory(req, res, next) {
  try {
    const { category } = req.params;
    const { pageSize = 20, page = 1 } = req.query;
    const keywords = await categoryClient.getKeywordsForInterests([category]);
    const query = keywords.length ? keywords.join(' OR ') : category;
    const result = await newsApi.getEverything({ q: query, sortBy: 'publishedAt', pageSize, page });
    await wrap(res, Promise.resolve(result));
  } catch (err) {
    next(err);
  }
}

async function getRelated(req, res, next) {
  try {
    const { title } = req.query;
    if (!title) {
      const error = new Error('Query parameter "title" is required to find related articles');
      error.statusCode = 400;
      throw error;
    }
    // Use the first few significant words of the title as a similarity query
    const keyPhrase = title.split(' ').slice(0, 6).join(' ');
    const result = await newsApi.getEverything({ q: keyPhrase, sortBy: 'relevancy', pageSize: 6, page: 1 });
    await wrap(res, Promise.resolve(result));
  } catch (err) {
    next(err);
  }
}

async function getArticleById(req, res, next) {
  try {
    const { id } = req.params;
    // Articles are not individually indexed by the upstream API, so we search
    // the current cache for a matching normalized id across cached result sets.
    let found = null;
    for (const [, entry] of cache.store.entries()) {
      const match = (entry.data.articles || []).find((a) => a.id === id);
      if (match) {
        found = match;
        break;
      }
    }

    if (!found) {
      const error = new Error('Article not found in current cache. It may have expired - please navigate from a listing page.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: found });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTrending,
  getLatest,
  searchArticles,
  getByInterests,
  getByCategory,
  getRelated,
  getArticleById
};
