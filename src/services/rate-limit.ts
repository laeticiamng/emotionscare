// @ts-nocheck

/**
 * Rate limiter avec backoff exponentiel et jitter pour Suno API
 * Limite: 20 requêtes / 10 secondes
 */

import { logger } from '@/lib/logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

class RateLimiter {
  private requests: number[] = [];
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      maxRequests: config.maxRequests || 20,
      windowMs: config.windowMs || 10000, // 10 seconds
      backoffMultiplier: config.backoffMultiplier || 2,
      maxBackoffMs: config.maxBackoffMs || 60000 // 1 minute max
    };
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    
    // Nettoyer les anciennes requêtes
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    // Si on a atteint la limite
    if (this.requests.length >= this.config.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.config.windowMs - (now - oldestRequest);
      
      // Ajouter du jitter (±20%)
      const jitter = waitTime * 0.2 * (Math.random() - 0.5);
      const totalWait = Math.min(
        waitTime + jitter,
        this.config.maxBackoffMs
      );

      logger.warn(`Rate limit reached. Waiting ${Math.round(totalWait)}ms`, undefined, 'MUSIC');
      await this.sleep(totalWait);
      
      // Réessayer après l'attente
      return this.acquire();
    }

    // Enregistrer cette requête
    this.requests.push(now);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset(): void {
    this.requests = [];
  }

  getStatus() {
    const now = Date.now();
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );
    
    return {
      current: this.requests.length,
      max: this.config.maxRequests,
      remaining: this.config.maxRequests - this.requests.length
    };
  }
}

// Instance singleton
export const sunoRateLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 10000
});
