export interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string, ttl: number): T | undefined {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.value;
  }
  if (entry) memoryCache.delete(key);
  return undefined;
}

export function setCache<T>(key: string, value: T): void {
  memoryCache.set(key, { value, timestamp: Date.now() });
}
