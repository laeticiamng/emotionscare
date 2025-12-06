// @ts-nocheck

import { logger } from '@/lib/logger';

interface RequestMetrics {
  url: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
}

class GlobalInterceptor {
  private static metrics: RequestMetrics[] = [];
  private static maxMetrics = 100;

  /**
   * Intercepteur global pour fetch avec monitoring
   */
  static async secureFetch(url: string, options?: RequestInit): Promise<Response | null> {
    const startTime = performance.now();
    const method = options?.method || 'GET';
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'EmotionsCare/1.0',
          'X-App-Version': '1.0.0',
          ...options?.headers,
        },
      });
      
      const duration = performance.now() - startTime;
      
      // Enregistrer les métriques
      this.recordMetric({
        url: this.sanitizeUrl(url),
        method,
        duration,
        status: response.status,
        timestamp: Date.now()
      });
      
      // Log des erreurs API
      if (!response.ok) {
        logger.warn(`API Error: ${method} ${url}`, { status: response.status }, 'API');
      }
      
      return response;
      
    } catch (error: any) {
      const duration = performance.now() - startTime;
      
      // Enregistrer l'erreur
      this.recordMetric({
        url: this.sanitizeUrl(url),
        method,
        duration,
        status: 0, // Erreur réseau
        timestamp: Date.now()
      });
      
      logger.error(`Network Error: ${method} ${url}`, error as Error, 'API');
      
      // Retourner null au lieu de lever l'erreur
      return null;
    }
  }

  private static sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return url.split('?')[0]; // Fallback
    }
  }

  private static recordMetric(metric: RequestMetrics): void {
    this.metrics.push(metric);
    
    // Limiter le nombre de métriques
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
    
    // Analytics silencieuses
    if (import.meta.env.PROD && metric.status >= 400) {
      this.reportErrorMetric(metric);
    }
  }

  private static reportErrorMetric(metric: RequestMetrics): void {
    // Reporter les erreurs API vers le monitoring
    logger.error('API Error Metric', {
      url: metric.url,
      status: metric.status,
      duration: metric.duration
    }, 'API');
  }

  /**
   * Obtenir les métriques récentes
   */
  static getMetrics(): RequestMetrics[] {
    return [...this.metrics];
  }

  /**
   * Obtenir les statistiques agrégées
   */
  static getAggregateStats() {
    if (this.metrics.length === 0) {
      return { averageLatency: 0, errorRate: 0, totalRequests: 0 };
    }

    const totalRequests = this.metrics.length;
    const averageLatency = this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
    const errorCount = this.metrics.filter(m => m.status >= 400 || m.status === 0).length;
    const errorRate = (errorCount / totalRequests) * 100;

    return {
      averageLatency: Math.round(averageLatency),
      errorRate: Math.round(errorRate * 100) / 100,
      totalRequests
    };
  }

  /**
   * Nettoyer les anciennes métriques
   */
  static cleanup(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
  }
}

// Auto-nettoyage toutes les heures
if (typeof window !== 'undefined') {
  setInterval(() => {
    GlobalInterceptor.cleanup();
  }, 60 * 60 * 1000);
}

export { GlobalInterceptor };
