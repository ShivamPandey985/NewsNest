/**
 * Lightweight guard that runs on every "app" page (not landing/about/404).
 * If the user hasn't completed onboarding yet, redirect them to it first.
 */
const Router = {
  requireOnboarding() {
    if (!Storage.isOnboarded()) {
      window.location.href = 'onboarding.html';
      return false;
    }
    return true;
  },
  goHomeIfOnboarded() {
    if (Storage.isOnboarded()) {
      window.location.href = 'home.html';
    }
  }
};

window.Router = Router;
