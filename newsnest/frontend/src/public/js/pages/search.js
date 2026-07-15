document.addEventListener('DOMContentLoaded', () => {
  if (!Router.requireOnboarding()) return;

  Navbar.render('search');
  Footer.render();

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const resultsGrid = document.getElementById('searchResultsGrid');
  const resultsInfo = document.getElementById('searchResultsInfo');

  let debounceTimer = null;

  async function runSearch(query) {
    if (!query || !query.trim()) {
      resultsGrid.innerHTML = '';
      resultsInfo.textContent = '';
      return;
    }

    resultsGrid.innerHTML = Skeleton.cards(6);
    resultsInfo.textContent = 'Searching...';

    try {
      const res = await API.search({ q: query, pageSize: 16 });
      resultsInfo.textContent = `${res.count} result${res.count === 1 ? '' : 's'} for "${query}"`;

      if (!res.data.length) {
        resultsGrid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>No articles found</h3><p>Try a different search term.</p></div>`;
        return;
      }
      ArticleCard.cacheArticles(res.data);
      resultsGrid.innerHTML = res.data.map((a) => ArticleCard.render(a)).join('');
      ArticleCard.attachBookmarkHandlers(resultsGrid);
    } catch (err) {
      resultsInfo.textContent = '';
      resultsGrid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Search failed</h3><p>${err.message}</p></div>`;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch(input.value);
  });

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(input.value), 500);
  });

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery) {
    input.value = initialQuery;
    runSearch(initialQuery);
  }
});
