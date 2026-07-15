/**
 * Thin fetch wrapper around the API Gateway. The frontend NEVER calls
 * the News API or any backend microservice directly - only the gateway,
 * whose base URL is injected at runtime via /config.js.
 */
const API = (() => {
  const BASE_URL = (window.__NEWSNEST_CONFIG__ && window.__NEWSNEST_CONFIG__.API_BASE_URL) || '/api/v1';

  async function request(path, { params = {}, method = 'GET' } = {}) {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
    ).toString();
    const finalUrl = `${BASE_URL}${path}${query ? `?${query}` : ''}`;

    try {
      const response = await fetch(finalUrl, { method });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error((data.error && data.error.message) || 'Something went wrong');
      }
      return data;
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        throw new Error('Cannot reach the server. Please check your connection.');
      }
      throw err;
    }
  }

  return {
    getTrending: (params) => request('/news/trending', { params }),
    getLatest: (params) => request('/news/latest', { params }),
    search: (params) => request('/news/search', { params }),
    getByInterests: (params) => request('/news/by-interests', { params }),
    getByCategory: (category, params) => request(`/news/by-category/${encodeURIComponent(category)}`, { params }),
    getRelated: (params) => request('/news/related', { params }),
    getArticleById: (id) => request(`/news/article/${encodeURIComponent(id)}`),
    getCategories: () => request('/categories'),
    getCategoryKeywords: (interests) => request('/categories/keywords', { params: { interests: interests.join(',') } })
  };
})();

window.API = API;
