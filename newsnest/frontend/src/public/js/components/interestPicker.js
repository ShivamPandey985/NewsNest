const InterestPicker = {
  async render(containerId, { selected = [] } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="grid-categories">${Skeleton.categories(12)}</div>`;

    try {
      const res = await API.getCategories();
      const categories = res.data;
      const selectedSet = new Set(selected);

      container.innerHTML = `
        <div class="grid-categories">
          ${categories.map((c) => `
            <button type="button" class="category-card ${selectedSet.has(c.id) ? 'selected' : ''}" data-interest-id="${c.id}">
              <span class="category-card-icon">${c.icon}</span>
              <span class="category-card-name">${c.name}</span>
            </button>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('[data-interest-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('selected');
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Couldn't load categories</h3><p>${err.message}</p></div>`;
    }
  },

  getSelected(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll('.category-card.selected')).map((btn) => btn.getAttribute('data-interest-id'));
  }
};

window.InterestPicker = InterestPicker;
