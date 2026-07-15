const ArticleCard = {
  timeAgo(dateStr) {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${Math.max(mins, 1)}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  },

  render(article, { badge } = {}) {
    const saved = Storage.isBookmarked(article.id);
    const image = article.imageUrl || '';
    const imageBlock = image
      ? `<img src="${image}" alt="${this.escape(article.title)}" loading="lazy" onerror="this.parentElement.classList.add('no-image'); this.remove();" />`
      : '';

    return `
      <article class="article-card fade-in-up" data-article-id="${article.id}">
        <div class="article-card-image-wrap">
          ${imageBlock}
          ${badge ? `<span class="article-card-badge">${badge}</span>` : ''}
          <button class="article-card-bookmark ${saved ? 'saved' : ''}" data-bookmark-btn="${article.id}" aria-label="Bookmark">
            ${saved ? '★' : '☆'}
          </button>
        </div>
        <div class="article-card-body">
          <span class="article-card-source">${this.escape(article.source)}</span>
          <h3 class="article-card-title"><a href="article.html?id=${encodeURIComponent(article.id)}">${this.escape(article.title)}</a></h3>
          <p class="article-card-desc">${this.escape(article.description || '')}</p>
          <div class="article-card-meta">
            <span>${this.timeAgo(article.publishedAt)}</span>
            <span>⏱ ${article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </article>
    `;
  },

  escape(str = '') {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  attachBookmarkHandlers(container) {
    container.querySelectorAll('[data-bookmark-btn]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-bookmark-btn');
        const card = btn.closest('.article-card');
        const article = ArticleCard.getCachedArticle(id);
        if (!article) return;

        const isSaved = Storage.toggleBookmark(article);
        btn.classList.toggle('saved', isSaved);
        btn.textContent = isSaved ? '★' : '☆';
        Toast[isSaved ? 'success' : 'info'](isSaved ? 'Article bookmarked' : 'Removed from bookmarks');
        AppState.emit('bookmarks-changed');
      });
    });
  },

  cacheArticles(articles) {
    window.__ARTICLE_CACHE__ = window.__ARTICLE_CACHE__ || {};
    let sessionCache = {};
    try {
      sessionCache = JSON.parse(sessionStorage.getItem('newsnest_article_cache')) || {};
    } catch {
      sessionCache = {};
    }
    articles.forEach((a) => {
      window.__ARTICLE_CACHE__[a.id] = a;
      sessionCache[a.id] = a;
    });
    try {
      sessionStorage.setItem('newsnest_article_cache', JSON.stringify(sessionCache));
    } catch {
      /* sessionStorage full or unavailable - non-fatal */
    }
  },

  getCachedArticle(id) {
    if (window.__ARTICLE_CACHE__ && window.__ARTICLE_CACHE__[id]) {
      return window.__ARTICLE_CACHE__[id];
    }
    try {
      const sessionCache = JSON.parse(sessionStorage.getItem('newsnest_article_cache')) || {};
      return sessionCache[id] || null;
    } catch {
      return null;
    }
  }
};

window.ArticleCard = ArticleCard;
