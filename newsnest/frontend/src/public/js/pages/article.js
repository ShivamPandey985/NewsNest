document.addEventListener('DOMContentLoaded', async () => {
  if (!Router.requireOnboarding()) return;

  Navbar.render('');
  Footer.render();

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');

  const content = document.getElementById('articleContent');
  const relatedGrid = document.getElementById('relatedGrid');

  if (!articleId) {
    content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>No article specified</h3></div>`;
    return;
  }

  function renderArticle(article) {
    document.title = `${article.title} — NewsNest`;
    const saved = Storage.isBookmarked(article.id);

    content.innerHTML = `
      <div class="article-detail fade-in-up">
        <div class="chip-row" style="margin-bottom:16px;">
          <span class="badge">${article.source}</span>
          <span class="badge">⏱ ${article.readingTimeMinutes} min read</span>
          ${article.publishedAt ? `<span class="badge">${new Date(article.publishedAt).toLocaleDateString()}</span>` : ''}
        </div>
        <h1 class="article-detail-title">${ArticleCard.escape(article.title)}</h1>
        ${article.author ? `<p class="article-detail-author">By ${ArticleCard.escape(article.author)}</p>` : ''}
        ${article.imageUrl ? `<div class="article-detail-image"><img src="${article.imageUrl}" alt="${ArticleCard.escape(article.title)}" onerror="this.parentElement.style.display='none';" /></div>` : ''}
        <p class="article-detail-body">${ArticleCard.escape(article.content || article.description || 'Full content is available on the original source.')}</p>
        <div class="article-detail-actions">
          <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Read Full Article ↗</a>
          <button class="btn btn-outline" id="detailBookmarkBtn">${saved ? '★ Bookmarked' : '☆ Bookmark'}</button>
        </div>
      </div>
    `;

    document.getElementById('detailBookmarkBtn').addEventListener('click', () => {
      const isSaved = Storage.toggleBookmark(article);
      document.getElementById('detailBookmarkBtn').textContent = isSaved ? '★ Bookmarked' : '☆ Bookmark';
      Toast[isSaved ? 'success' : 'info'](isSaved ? 'Article bookmarked' : 'Removed from bookmarks');
      AppState.emit('bookmarks-changed');
    });

    loadRelated(article.title);
  }

  async function loadRelated(title) {
    relatedGrid.innerHTML = Skeleton.cards(3);
    try {
      const res = await API.getRelated({ title });
      const filtered = res.data.filter((a) => a.id !== articleId).slice(0, 3);
      if (!filtered.length) {
        relatedGrid.closest('.section').style.display = 'none';
        return;
      }
      ArticleCard.cacheArticles(filtered);
      relatedGrid.innerHTML = filtered.map((a) => ArticleCard.render(a)).join('');
      ArticleCard.attachBookmarkHandlers(relatedGrid);
    } catch {
      relatedGrid.closest('.section').style.display = 'none';
    }
  }

  content.innerHTML = `<div class="spinner-wrap"><div class="spinner"></div><p>Loading article...</p></div>`;

  const cached = ArticleCard.getCachedArticle(articleId);
  if (cached) {
    renderArticle(cached);
    return;
  }

  try {
    const res = await API.getArticleById(articleId);
    renderArticle(res.data);
  } catch (err) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📄</div>
        <h3>Article no longer available</h3>
        <p>${err.message}</p>
        <a href="home.html" class="btn btn-primary" style="margin-top:16px;">Back to Home</a>
      </div>
    `;
  }
});
