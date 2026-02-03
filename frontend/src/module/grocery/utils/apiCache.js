/**
 * Simple in-memory cache for API responses
 * Helps prevent duplicate requests and speeds up repeated calls
 */

class APICache {
  constructor() {
    this.cache = new Map();
    this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default
    this.pendingRequests = new Map();
  }

  /**
   * Get cached data or fetch if not cached/expired
   */
  async getOrFetch(key, fetchFn, ttl = this.DEFAULT_TTL) {
    // Check if there's a pending request for this key
    const pendingRequest = this.pendingRequests.get(key);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Check cache
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // Fetch new data
    const requestPromise = fetchFn().then((data) => {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      });
      this.pendingRequests.delete(key);
      return data;
    }).catch((error) => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Invalidate cache for a specific key
   */
  invalidate(key) {
    this.cache.delete(key);
  }

  /**
   * Invalidate cache matching a pattern
   */
  invalidatePattern(pattern) {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Clean expired entries
   */
  cleanExpired() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Check if data is cached and not expired (synchronous)
   */
  has(key) {
    const cached = this.cache.get(key);
    return cached !== undefined && Date.now() < cached.expiresAt;
  }

  /**
   * Get cached data synchronously (returns null if not cached or expired)
   */
  getSync(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
    return null;
  }
}

// Singleton instance
export const apiCache = new APICache();

// Clean expired entries every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanExpired();
  }, 60 * 1000);
}
