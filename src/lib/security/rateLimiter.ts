
/**
 * Client-side rate limiting implementation
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (context?: any) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class ClientRateLimiter {
  private cache = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.resetTime) {
        this.cache.delete(key);
      }
    }
  }

  private getKey(action: string, context?: any, keyGenerator?: (context?: any) => string): string {
    if (keyGenerator) {
      return `${action}:${keyGenerator(context)}`;
    }
    return `${action}:global`;
  }

  isAllowed(action: string, config: RateLimitConfig, context?: any): boolean {
    const key = this.getKey(action, context, config.keyGenerator);
    const now = Date.now();
    
    let entry = this.cache.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 1,
        resetTime: now + config.windowMs
      };
      this.cache.set(key, entry);
      return true;
    }
    
    if (entry.count >= config.maxRequests) {
      return false;
    }
    
    entry.count++;
    this.cache.set(key, entry);
    return true;
  }

  getRemainingRequests(action: string, config: RateLimitConfig, context?: any): number {
    const key = this.getKey(action, context, config.keyGenerator);
    const entry = this.cache.get(key);
    
    if (!entry || Date.now() > entry.resetTime) {
      return config.maxRequests;
    }
    
    return Math.max(0, config.maxRequests - entry.count);
  }

  getResetTime(action: string, config: RateLimitConfig, context?: any): number | null {
    const key = this.getKey(action, context, config.keyGenerator);
    const entry = this.cache.get(key);
    
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }
    
    return entry.resetTime;
  }

  clear(action?: string): void {
    if (action) {
      // Clear specific action entries
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${action}:`)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all entries
      this.cache.clear();
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Global rate limiter instance
const rateLimiter = new ClientRateLimiter();

// Predefined rate limit configurations
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyGenerator: (context: { email?: string }) => context?.email || 'anonymous'
  },
  API_CALLS: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  SEARCH_REQUESTS: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  FILE_UPLOADS: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  PASSWORD_RESET: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyGenerator: (context: { email?: string }) => context?.email || 'anonymous'
  },
  CHAT_MESSAGES: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  }
} as const;

/**
 * Check if an action is rate limited
 */
export const checkRateLimit = (
  action: keyof typeof RATE_LIMITS,
  context?: any
): { allowed: boolean; remaining: number; resetTime: number | null } => {
  const config = RATE_LIMITS[action];
  const allowed = rateLimiter.isAllowed(action, config, context);
  const remaining = rateLimiter.getRemainingRequests(action, config, context);
  const resetTime = rateLimiter.getResetTime(action, config, context);

  return { allowed, remaining, resetTime };
};

/**
 * Rate limiting decorator for async functions
 */
export const withRateLimit = <T extends (...args: any[]) => Promise<any>>(
  action: keyof typeof RATE_LIMITS,
  fn: T,
  contextExtractor?: (...args: Parameters<T>) => any
): T => {
  return (async (...args: Parameters<T>) => {
    const context = contextExtractor ? contextExtractor(...args) : undefined;
    const { allowed, resetTime } = checkRateLimit(action, context);

    if (!allowed) {
      const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
      throw new Error(`Trop de tentatives. Réessayez dans ${waitTime} secondes.`);
    }

    return fn(...args);
  }) as T;
};

/**
 * Clear rate limit for specific action
 */
export const clearRateLimit = (action?: keyof typeof RATE_LIMITS): void => {
  rateLimiter.clear(action);
};

export { rateLimiter };
