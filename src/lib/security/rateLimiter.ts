interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private configs: Record<string, RateLimitConfig> = {
    api_calls: { windowMs: 60000, maxRequests: 100 }, // 100 req/min
    auth_attempts: { windowMs: 300000, maxRequests: 5 }, // 5 req/5min
    page_access: { windowMs: 1000, maxRequests: 10 }, // 10 req/sec
  };

  checkLimit(key: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const config = this.configs[key];
    
    if (!config) {
      return { allowed: true };
    }

    const entry = this.limits.get(key);
    
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return { allowed: true };
    }

    if (entry.count >= config.maxRequests) {
      return { allowed: false, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true };
  }

  // Nettoyer les entrées expirées
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Nettoyage automatique toutes les 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}
