/**
 * Rate limiting avancé avec cache et budget monitoring
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstLimit?: number;
  costPerRequest?: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface BudgetAlert {
  service: string;
  currentCost: number;
  threshold: number;
  timestamp: number;
}

class AdvancedRateLimiter {
  private limits = new Map<string, { count: number; resetTime: number; cost: number }>();
  private cache = new Map<string, CacheEntry>();
  private budgetThresholds = new Map<string, number>();
  private budgetCurrentCosts = new Map<string, number>();

  private configs: Record<string, RateLimitConfig> = {
    'ai_chat': { maxRequests: 20, windowMs: 60000, costPerRequest: 0.01 },
    'ai_story': { maxRequests: 5, windowMs: 300000, costPerRequest: 0.05 },
    'ai_tts': { maxRequests: 10, windowMs: 60000, costPerRequest: 0.02 },
    'music_suno': { maxRequests: 3, windowMs: 600000, costPerRequest: 0.20 },
    'emotion_hume': { maxRequests: 50, windowMs: 60000, costPerRequest: 0.005 },
    'image_upload': { maxRequests: 10, windowMs: 300000 },
    'data_export': { maxRequests: 2, windowMs: 3600000 } // 2/hour
  };

  constructor() {
    // Budget thresholds par défaut
    this.budgetThresholds.set('openai', 10.0); // $10/hour
    this.budgetThresholds.set('suno', 5.0);    // $5/hour
    this.budgetThresholds.set('hume', 2.0);    // $2/hour

    // Reset budget costs every hour
    setInterval(() => this.resetBudgets(), 3600000);
  }

  /**
   * Vérifier les limites avec coût
   */
  checkLimit(key: string, userId?: string): { 
    allowed: boolean; 
    resetTime?: number; 
    budgetAlert?: BudgetAlert;
    fromCache?: boolean;
  } {
    const limitKey = userId ? `${key}:${userId}` : key;
    const config = this.configs[key];
    
    if (!config) {
      return { allowed: true };
    }

    const now = Date.now();
    const entry = this.limits.get(limitKey);

    // Reset if window expired
    if (!entry || now > entry.resetTime) {
      this.limits.set(limitKey, {
        count: 1,
        resetTime: now + config.windowMs,
        cost: config.costPerRequest || 0
      });
      
      this.updateBudget(key, config.costPerRequest || 0);
      return { allowed: true };
    }

    // Check rate limit
    if (entry.count >= config.maxRequests) {
      return { allowed: false, resetTime: entry.resetTime };
    }

    // Check budget limit
    const budgetAlert = this.checkBudgetLimit(key, config.costPerRequest || 0);
    if (budgetAlert) {
      return { allowed: false, budgetAlert };
    }

    // Allow request
    entry.count++;
    entry.cost += config.costPerRequest || 0;
    this.updateBudget(key, config.costPerRequest || 0);

    return { allowed: true };
  }

  /**
   * Cache avec TTL pour éviter requêtes identiques
   */
  getCached(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Mettre en cache une réponse
   */
  setCache(key: string, data: any, ttlMs: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  /**
   * Générer clé de cache pour prompt
   */
  getCacheKey(service: string, prompt: string, userId?: string): string {
    const promptHash = this.simpleHash(prompt);
    return `${service}:${promptHash}${userId ? `:${userId}` : ''}`;
  }

  /**
   * Vérifier les limites de budget
   */
  private checkBudgetLimit(service: string, cost: number): BudgetAlert | null {
    const serviceType = this.getServiceType(service);
    const threshold = this.budgetThresholds.get(serviceType);
    const currentCost = this.budgetCurrentCosts.get(serviceType) || 0;

    if (threshold && currentCost + cost > threshold) {
      return {
        service: serviceType,
        currentCost: currentCost + cost,
        threshold,
        timestamp: Date.now()
      };
    }

    return null;
  }

  /**
   * Mettre à jour le coût budgétaire
   */
  private updateBudget(service: string, cost: number): void {
    const serviceType = this.getServiceType(service);
    const current = this.budgetCurrentCosts.get(serviceType) || 0;
    this.budgetCurrentCosts.set(serviceType, current + cost);
  }

  /**
   * Extraire le type de service (openai, suno, hume)
   */
  private getServiceType(service: string): string {
    if (service.startsWith('ai_')) return 'openai';
    if (service.startsWith('music_')) return 'suno';
    if (service.startsWith('emotion_')) return 'hume';
    return 'other';
  }

  /**
   * Reset budgets (appelé chaque heure)
   */
  private resetBudgets(): void {
    this.budgetCurrentCosts.clear();
    console.log('Budget costs reset');
  }

  /**
   * Hash simple pour cache keys
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Obtenir les statistiques actuelles
   */
  getStats(): {
    activeRateLimits: number;
    cacheEntries: number;
    budgetUsage: Record<string, { used: number; limit: number }>;
  } {
    const budgetUsage: Record<string, { used: number; limit: number }> = {};
    
    for (const [service, threshold] of this.budgetThresholds.entries()) {
      budgetUsage[service] = {
        used: this.budgetCurrentCosts.get(service) || 0,
        limit: threshold
      };
    }

    return {
      activeRateLimits: this.limits.size,
      cacheEntries: this.cache.size,
      budgetUsage
    };
  }

  /**
   * Nettoyer les entrées expirées
   */
  cleanup(): void {
    const now = Date.now();
    
    // Clean rate limits
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }

    // Clean cache
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const advancedRateLimiter = new AdvancedRateLimiter();

// Nettoyage automatique toutes les 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => advancedRateLimiter.cleanup(), 5 * 60 * 1000);
}

/**
 * Hook pour utiliser le rate limiter avancé
 */
export const useAdvancedRateLimit = () => {
  const checkLimit = (service: string, userId?: string) => {
    return advancedRateLimiter.checkLimit(service, userId);
  };

  const getCached = (service: string, prompt: string, userId?: string) => {
    const cacheKey = advancedRateLimiter.getCacheKey(service, prompt, userId);
    return advancedRateLimiter.getCached(cacheKey);
  };

  const setCache = (service: string, prompt: string, data: any, ttlMs?: number, userId?: string) => {
    const cacheKey = advancedRateLimiter.getCacheKey(service, prompt, userId);
    advancedRateLimiter.setCache(cacheKey, data, ttlMs);
  };

  const getStats = () => {
    return advancedRateLimiter.getStats();
  };

  return {
    checkLimit,
    getCached,
    setCache,
    getStats
  };
};