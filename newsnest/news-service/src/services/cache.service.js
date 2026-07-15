const env = require('../config/env');

/**
 * Simple in-memory TTL cache (Map-based).
 * Fully stateless across restarts - no external cache/DB used,
 * satisfying the "no database" requirement.
 */
class CacheService {
  constructor(ttlMs = env.cacheTtlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  _isExpired(entry) {
    return Date.now() > entry.expiresAt;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (this._isExpired(entry)) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data) {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.store.clear();
  }

  size() {
    return this.store.size;
  }
}

module.exports = new CacheService();
