document.addEventListener('DOMContentLoaded', async () => {
  if (!Router.requireOnboarding()) return;

  Navbar.render('home');
  Footer.render();

  const userName = Storage.getUserName();
  const greetingEl = document.getElementById('userGreeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    const part = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    greetingEl.textContent = `Good ${part}, ${userName || 'there'} 👋`;
  }

  const trendingGrid = document.getElementById('trendingGrid');
  const latestGrid = document.getElementById('latestGrid');
  const forYouGrid = document.getElementById('forYouGrid');

  async function loadSection(gridEl, loaderFn, badge) {
    if (!gridEl) return;
    gridEl.innerHTML = Skeleton.cards(6);
    try {
      const res = await loaderFn();
      if (!res.data.length) {
        gridEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><h3>No articles found</h3><p>Try again in a few minutes.</p></div>`;
        return;
      }
      ArticleCard.cacheArticles(res.data);
      gridEl.innerHTML = res.data.map((a, i) => ArticleCard.render(a, { badge })).join('');
      ArticleCard.attachBookmarkHandlers(gridEl);
    } catch (err) {
      gridEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Couldn't load articles</h3><p>${err.message}</p></div>`;
    }
  }

  const interests = Storage.getInterests();

  loadSection(trendingGrid, () => API.getTrending({ pageSize: 8 }), '🔥 Trending');
  loadSection(latestGrid, () => API.getLatest({ pageSize: 8 }), '🆕 Latest');

  if (interests.length && forYouGrid) {
    loadSection(forYouGrid, () => API.getByInterests({ interests: interests.join(','), pageSize: 9 }), '⭐ For You');
  } else if (forYouGrid) {
    forYouGrid.closest('.section').style.display = 'none';
  }
});
