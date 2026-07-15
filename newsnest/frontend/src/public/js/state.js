/**
 * Small pub/sub for cross-component state changes (e.g. bookmark toggled
 * on the home page should reflect instantly if the bookmarks page is open
 * in the same session). Not persistence - Storage.js handles that.
 */
const AppState = (() => {
  const listeners = {};

  function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }

  function emit(event, payload) {
    (listeners[event] || []).forEach((cb) => cb(payload));
  }

  return { on, emit };
})();

window.AppState = AppState;
