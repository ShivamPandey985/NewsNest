/**
 * Shows a toast whenever the browser goes offline/online.
 * Included on every "app" page so users get feedback if their
 * connection drops mid-session.
 */
window.addEventListener('offline', () => {
  if (window.Toast) Toast.error("You're offline. Some content may not load.");
});
window.addEventListener('online', () => {
  if (window.Toast) Toast.success("You're back online.");
});
