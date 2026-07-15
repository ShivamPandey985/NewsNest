const ThemeManager = (() => {
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.setTheme(theme);
    document.querySelectorAll('[data-theme-icon]').forEach((el) => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  function toggle() {
    const current = Storage.getTheme();
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    apply(Storage.getTheme());
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, apply, toggle };
})();

window.ThemeManager = ThemeManager;
