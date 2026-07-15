document.addEventListener('DOMContentLoaded', () => {
  if (!Router.requireOnboarding()) return;

  Navbar.render('bookmarks');
  Footer.render();

  const grid = document.getElementById('bookmarksGrid');
  const countLabel = document.getElementById('bookmarksCount');

  function render() {
    const bookmarks = Storage.getBookmarks();
    countLabel.textContent = `${bookmarks.length} saved article${bookmarks.length === 1 ? '' : 's'}`;

    if (!bookmarks.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔖</div>
          <h3>No bookmarks yet</h3>
          <p>Save articles you like and they'll show up here.</p>
          <a href="home.html" class="btn btn-primary" style="margin-top:16px;">Browse News</a>
        </div>
      `;
      return;
    }

    ArticleCard.cacheArticles(bookmarks);
    grid.innerHTML = bookmarks.map((a) => ArticleCard.render(a)).join('');
    ArticleCard.attachBookmarkHandlers(grid);
  }

  AppState.on('bookmarks-changed', render);
  render();
});
