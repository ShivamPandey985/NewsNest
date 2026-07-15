const Navbar = {
  render(activePage = '') {
    const root = document.getElementById('navbar-root');
    if (!root) return;

    const links = [
      { href: 'home.html', label: 'Home', key: 'home' },
      { href: 'category.html', label: 'Categories', key: 'category' },
      { href: 'search.html', label: 'Search', key: 'search' },
      { href: 'bookmarks.html', label: 'Bookmarks', key: 'bookmarks' },
      { href: 'about.html', label: 'About', key: 'about' }
    ];

    root.innerHTML = `
      <nav class="navbar">
        <div class="navbar-inner">
          <a href="home.html" class="navbar-brand">📰 NewsNest</a>
          <div class="navbar-links" id="navbarLinks">
            ${links.map((l) => `<a href="${l.href}" class="navbar-link ${activePage === l.key ? 'active' : ''}">${l.label}</a>`).join('')}
          </div>
          <div class="navbar-actions">
            <button class="btn-icon" data-theme-toggle aria-label="Toggle theme">
              <span data-theme-icon class="theme-toggle-icon">🌙</span>
            </button>
            <a href="settings.html" class="btn-icon" aria-label="Settings">⚙️</a>
            <button class="navbar-toggle" id="navbarToggle" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
    `;

    const toggle = document.getElementById('navbarToggle');
    const navLinks = document.getElementById('navbarLinks');
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    }

    ThemeManager.init();
  }
};

window.Navbar = Navbar;
