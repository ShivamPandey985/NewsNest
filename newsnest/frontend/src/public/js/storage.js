/**
 * All persistent user state lives in localStorage - the backend is
 * completely stateless. This module centralizes every read/write so
 * the rest of the app never touches localStorage directly.
 */
const STORAGE_KEYS = {
  USER_NAME: 'newsnest_user_name',
  INTERESTS: 'newsnest_interests',
  THEME: 'newsnest_theme',
  BOOKMARKS: 'newsnest_bookmarks',
  ONBOARDED: 'newsnest_onboarded'
};

const Storage = {
  getUserName() {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '';
  },
  setUserName(name) {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  getInterests() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERESTS)) || [];
    } catch {
      return [];
    }
  },
  setInterests(interests) {
    localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(interests));
  },

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  isOnboarded() {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  },
  setOnboarded(value) {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, value ? 'true' : 'false');
  },

  getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) || [];
    } catch {
      return [];
    }
  },
  setBookmarks(bookmarks) {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  },
  isBookmarked(articleId) {
    return this.getBookmarks().some((a) => a.id === articleId);
  },
  addBookmark(article) {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.some((a) => a.id === article.id)) {
      bookmarks.unshift({ ...article, savedAt: new Date().toISOString() });
      this.setBookmarks(bookmarks);
    }
  },
  removeBookmark(articleId) {
    const bookmarks = this.getBookmarks().filter((a) => a.id !== articleId);
    this.setBookmarks(bookmarks);
  },
  toggleBookmark(article) {
    if (this.isBookmarked(article.id)) {
      this.removeBookmark(article.id);
      return false;
    }
    this.addBookmark(article);
    return true;
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
};

window.Storage = Storage;
