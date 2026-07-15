document.addEventListener('DOMContentLoaded', async () => {
  if (!Router.requireOnboarding()) return;

  Navbar.render('category');
  Footer.render();

  const listContainer = document.getElementById('categoryChipList');
  const resultsGrid = document.getElementById('categoryResultsGrid');
  const activeTitle = document.getElementById('activeCategoryTitle');

  let categories = [];

  function getCategoryFromHash() {
    return window.location.hash ? window.location.hash.replace('#', '') : null;
  }

  async function loadCategories() {
    listContainer.innerHTML = `<div class="skeleton" style="height:42px;width:100%;"></div>`;
    try {
      const res = await API.getCategories();
      categories = res.data;
      listContainer.innerHTML = `
        <div class="chip-row">
          ${categories.map((c) => `<button type="button" class="chip" data-category="${c.id}">${c.icon} ${c.name}</button>`).join('')}
        </div>
      `;
      listContainer.querySelectorAll('[data-category]').forEach((chip) => {
        chip.addEventListener('click', () => {
          window.location.hash = chip.getAttribute('data-category');
        });
      });

      const initial = getCategoryFromHash() || categories[0].id;
      selectCategory(initial);
    } catch (err) {
      listContainer.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Couldn't load categories</h3><p>${err.message}</p></div>`;
    }
  }

  async function selectCategory(categoryId) {
    listContainer.querySelectorAll('[data-category]').forEach((chip) => {
      chip.classList.toggle('active', chip.getAttribute('data-category') === categoryId);
    });

    const category = categories.find((c) => c.id === categoryId);
    activeTitle.textContent = category ? `${category.icon} ${category.name}` : 'Category';

    resultsGrid.innerHTML = Skeleton.cards(6);
    try {
      const res = await API.getByCategory(categoryId, { pageSize: 12 });
      if (!res.data.length) {
        resultsGrid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><h3>No articles in this category right now</h3></div>`;
        return;
      }
      ArticleCard.cacheArticles(res.data);
      resultsGrid.innerHTML = res.data.map((a) => ArticleCard.render(a)).join('');
      ArticleCard.attachBookmarkHandlers(resultsGrid);
    } catch (err) {
      resultsGrid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Couldn't load articles</h3><p>${err.message}</p></div>`;
    }
  }

  window.addEventListener('hashchange', () => {
    const cat = getCategoryFromHash();
    if (cat) selectCategory(cat);
  });

  loadCategories();
});
