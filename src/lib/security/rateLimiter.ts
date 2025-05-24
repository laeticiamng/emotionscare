
/**
 * Client-side rate limiting system
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

export const RATE_LIMITS = {
  api_calls: { maxRequests: 60, windowMs: 60000 }, // 60 requests per minute
  login_attempts: { maxRequests: 5, windowMs: 300000, blockDurationMs: 900000 }, // 5 attempts per 5 minutes, block for 15 minutes
  scan_requests: { maxRequests: 10, windowMs: 60000 }, // 10 scans per minute
  chat_messages: { maxRequests: 30, windowMs: 60000 }, // 30 messages per minute
  file_uploads: { maxRequests: 10, windowMs: 300000 }, // 10 uploads per 5 minutes
} as const;

interface RateLimitEntry {
  timestamps: number[];
  blockedUntil?: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();

  private getKey(action: string, context?: any): string {
    const contextStr = context ? JSON.stringify(context) : '';
    return `${action}:${contextStr}`;
  }

  private cleanExpiredEntries(key: string, config: RateLimitConfig): void {
    const entry = this.storage.get(key);
    if (!entry) return;

    const now = Date.now();
    const cutoff = now - config.windowMs;
    
    entry.timestamps = entry.timestamps.filter(timestamp => timestamp > cutoff);
    
    if (entry.blockedUntil && entry.blockedUntil < now) {
      delete entry.blockedUntil;
    }

    if (entry.timestamps.length === 0 && !entry.blockedUntil) {
      this.storage.delete(key);
    }
  }

  public checkLimit(
    action: keyof typeof RATE_LIMITS,
    context?: any
  ): { allowed: boolean; remaining: number; resetTime: number | null } {
    const config = RATE_LIMITS[action];
    const key = this.getKey(action, context);
    const now = Date.now();

    this.cleanExpiredEntries(key, config);

    let entry = this.storage.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.storage.set(key, entry);
    }

    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil
      };
    }

    const currentCount = entry.timestamps.length;
    const remaining = Math.max(0, config.maxRequests - currentCount);

    if (currentCount >= config.maxRequests) {
      // Rate limit exceeded
      if (config.blockDurationMs) {
        entry.blockedUntil = now + config.blockDurationMs;
      }
      
      const oldestTimestamp = entry.timestamps[0];
      const resetTime = oldestTimestamp + config.windowMs;
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: config.blockDurationMs ? entry.blockedUntil : resetTime
      };
    }

    // Allow the request and record it
    entry.timestamps.push(now);
    
    const oldestTimestamp = entry.timestamps[0];
    const resetTime = oldestTimestamp + config.windowMs;

    return {
      allowed: true,
      remaining: remaining - 1,
      resetTime
    };
  }

  public reset(action: keyof typeof RATE_LIMITS, context?: any): void {
    const key = this.getKey(action, context);
    this.storage.delete(key);
  }

  public getRemainingRequests(action: keyof typeof RATE_LIMITS, context?: any): number {
    const config = RATE_LIMITS[action];
    const key = this.getKey(action, context);
    
    this.cleanExpiredEntries(key, config);
    
    const entry = this.storage.get(key);
    if (!entry || (entry.blockedUntil && entry.blockedUntil > Date.now())) {
      return 0;
    }
    
    return Math.max(0, config.maxRequests - entry.timestamps.length);
  }
}

export const rateLimiter = new RateLimiter();

export const checkRateLimit = (
  action: keyof typeof RATE_LIMITS,
  context?: any
) => rateLimiter.checkLimit(action, context);
