const Footer = {
  render() {
    const root = document.getElementById('footer-root');
    if (!root) return;

    const year = new Date().getFullYear();

    root.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a href="home.html" class="navbar-brand">📰 NewsNest</a>
              <p class="footer-brand-desc">Personalized, interest-based news for everyone — from UPSC aspirants to tech enthusiasts to sports fans.</p>
            </div>
            <div class="footer-col">
              <h4>Explore</h4>
              <a href="home.html">Home</a>
              <a href="category.html">Categories</a>
              <a href="search.html">Search</a>
              <a href="bookmarks.html">Bookmarks</a>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <a href="about.html">About Us</a>
              <a href="settings.html">Settings</a>
            </div>
            <div class="footer-col">
              <h4>Popular Interests</h4>
              <a href="category.html#technology">Technology</a>
              <a href="category.html#upsc">UPSC</a>
              <a href="category.html#cricket">Cricket</a>
              <a href="category.html#business">Business</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} NewsNest. All rights reserved.</span>
            <div class="footer-socials">
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="GitHub">🐙</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};

window.Footer = Footer;
