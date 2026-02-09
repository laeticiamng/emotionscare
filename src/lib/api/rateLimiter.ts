/**
 * Client-side rate limiter for Supabase Edge Function calls.
 *
 * Uses a sliding-window counter per endpoint key to throttle
 * requests before they hit the network. This reduces unnecessary
 * 429 responses and protects edge function quotas.
 */

interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
}

interface RateLimiterConfig {
  /** Maximum requests allowed in the window (default: 10) */
  maxRequests: number;
  /** Window duration in milliseconds (default: 60_000 = 1 minute) */
  windowMs: number;
  /** Cooldown after exceeding the limit, in milliseconds (default: 30_000 = 30s) */
  cooldownMs: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxRequests: 10,
  windowMs: 60_000,
  cooldownMs: 30_000,
};

const buckets = new Map<string, RateLimitEntry>();

function getOrCreateEntry(key: string): RateLimitEntry {
  let entry = buckets.get(key);
  if (!entry) {
    entry = { timestamps: [], blocked: false };
    buckets.set(key, entry);
  }
  return entry;
}

function pruneExpiredTimestamps(entry: RateLimitEntry, windowMs: number): void {
  const cutoff = Date.now() - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
}

/**
 * Check whether a request to `key` is allowed under the current rate limit.
 *
 * @returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(
  key: string,
  config: Partial<RateLimiterConfig> = {}
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const { maxRequests, windowMs, cooldownMs } = { ...DEFAULT_CONFIG, ...config };
  const entry = getOrCreateEntry(key);

  // If currently in cooldown, check if cooldown has elapsed
  if (entry.blocked) {
    const lastTs = entry.timestamps[entry.timestamps.length - 1] ?? 0;
    const elapsed = Date.now() - lastTs;
    if (elapsed < cooldownMs) {
      return { allowed: false, retryAfterMs: cooldownMs - elapsed };
    }
    entry.blocked = false;
    entry.timestamps = [];
  }

  pruneExpiredTimestamps(entry, windowMs);

  if (entry.timestamps.length >= maxRequests) {
    entry.blocked = true;
    return { allowed: false, retryAfterMs: cooldownMs };
  }

  entry.timestamps.push(Date.now());
  return { allowed: true };
}

/**
 * Convenience wrapper: throws if rate-limited (for use in service calls).
 */
export function assertRateLimit(
  key: string,
  config: Partial<RateLimiterConfig> = {}
): void {
  const result = checkRateLimit(key, config);
  if (!result.allowed) {
    const seconds = Math.ceil(result.retryAfterMs / 1000);
    throw new RateLimitError(
      `Trop de requetes. Reessayez dans ${seconds}s.`,
      result.retryAfterMs
    );
  }
}

export class RateLimitError extends Error {
  public readonly retryAfterMs: number;

  constructor(message: string, retryAfterMs: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * Reset the rate limiter for a given key (useful in tests).
 */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

/**
 * Reset all rate limiter state.
 */
export function resetAllRateLimits(): void {
  buckets.clear();
}

/**
 * Pre-configured rate limit configs for specific endpoints.
 */
export const RATE_LIMITS = {
  emotionalScan: { maxRequests: 10, windowMs: 60_000, cooldownMs: 30_000 },
  musicGeneration: { maxRequests: 5, windowMs: 60_000, cooldownMs: 60_000 },
  coachMessage: { maxRequests: 20, windowMs: 60_000, cooldownMs: 15_000 },
  aiAnalysis: { maxRequests: 8, windowMs: 60_000, cooldownMs: 30_000 },
} as const;
