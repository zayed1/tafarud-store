/**
 * Client-side sessionStorage cache with TTL support.
 * Speeds up navigation by avoiding redundant API calls within a session.
 */

const CACHE_PREFIX = "tafarud_cache_";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cached data from sessionStorage.
 * Returns null if not found or expired.
 */
export function getCached<T>(key: string, ttlMs = 5 * 60 * 1000): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > ttlMs) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Store data in sessionStorage with timestamp.
 */
export function setCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Storage full or unavailable - silently fail
  }
}

/**
 * Clear a specific cache entry.
 */
export function clearCache(key: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // ignore
  }
}

/**
 * Clear all tafarud cache entries.
 */
export function clearAllCache(): void {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k?.startsWith(CACHE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}
