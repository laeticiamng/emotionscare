// @ts-nocheck

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
}

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  isAllowed(identifier: string, config: RateLimitConfig): boolean {
    const key = config.keyGenerator ? config.keyGenerator(identifier) : identifier;
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (record.count >= config.maxRequests) {
      return false;
    }

    record.count += 1;
    return true;
  }

  getRemainingTime(identifier: string, config: RateLimitConfig): number {
    const key = config.keyGenerator ? config.keyGenerator(identifier) : identifier;
    const record = this.attempts.get(key);
    
    if (!record) return 0;
    
    const remaining = record.resetTime - Date.now();
    return Math.max(0, remaining);
  }

  reset(identifier: string, config?: RateLimitConfig): void {
    const key = config?.keyGenerator ? config.keyGenerator(identifier) : identifier;
    this.attempts.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

export const globalRateLimiter = new RateLimiter();

// Cleanup old entries every 5 minutes
setInterval(() => {
  globalRateLimiter.cleanup();
}, 5 * 60 * 1000);

// Rate limit configurations
export const RATE_LIMITS = {
  API_CALLS: { windowMs: 60000, maxRequests: 100 }, // 100 per minute
  LOGIN_ATTEMPTS: { windowMs: 900000, maxRequests: 5 }, // 5 per 15 minutes
  PASSWORD_RESET: { windowMs: 3600000, maxRequests: 3 }, // 3 per hour
  FORM_SUBMISSIONS: { windowMs: 60000, maxRequests: 10 }, // 10 per minute
};
