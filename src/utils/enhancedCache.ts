
import { QueryClient } from '@tanstack/react-query';

// Cache intelligent avec différentes stratégies
export class EnhancedCache {
  private memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private observers = new Map<string, Set<(data: any) => void>>();
  
  // Stratégies de cache
  private strategies = {
    // Cache court pour les données fréquemment mises à jour
    realtime: { ttl: 30000, maxSize: 50 }, // 30 secondes
    // Cache moyen pour les données utilisateur
    user: { ttl: 300000, maxSize: 100 }, // 5 minutes
    // Cache long pour les données statiques
    static: { ttl: 3600000, maxSize: 200 }, // 1 heure
    // Cache persistant pour les préférences
    persistent: { ttl: 86400000, maxSize: 50 } // 24 heures
  };

  set(key: string, data: any, strategy: keyof typeof this.strategies = 'user') {
    const config = this.strategies[strategy];
    
    // Nettoyer le cache si nécessaire
    this.cleanup(strategy);
    
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: config.ttl
    });

    // Notifier les observateurs
    this.notifyObservers(key, data);
    
    // Sauvegarder en localStorage pour les données persistantes
    if (strategy === 'persistent') {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify({
          data,
          timestamp: Date.now(),
          ttl: config.ttl
        }));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
  }

  get(key: string, strategy: keyof typeof this.strategies = 'user') {
    // Vérifier le cache mémoire
    const cached = this.memoryCache.get(key);
    if (cached && this.isValid(cached)) {
      return cached.data;
    }

    // Vérifier localStorage pour les données persistantes
    if (strategy === 'persistent') {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (this.isValid(parsed)) {
            // Restaurer en cache mémoire
            this.memoryCache.set(key, parsed);
            return parsed.data;
          }
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }

    return null;
  }

  invalidate(pattern?: string) {
    if (pattern) {
      // Invalider les clés qui matchent le pattern
      const regex = new RegExp(pattern);
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          this.memoryCache.delete(key);
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } else {
      // Vider tout le cache
      this.memoryCache.clear();
      // Nettoyer localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  subscribe(key: string, callback: (data: any) => void) {
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    this.observers.get(key)!.add(callback);

    // Retourner une fonction de désabonnement
    return () => {
      const observers = this.observers.get(key);
      if (observers) {
        observers.delete(callback);
        if (observers.size === 0) {
          this.observers.delete(key);
        }
      }
    };
  }

  private isValid(cached: { timestamp: number; ttl: number }) {
    return Date.now() - cached.timestamp < cached.ttl;
  }

  private cleanup(strategy: keyof typeof this.strategies) {
    const config = this.strategies[strategy];
    const strategyKeys = Array.from(this.memoryCache.keys())
      .filter(key => {
        // Logique pour déterminer si une clé appartient à cette stratégie
        // Pour simplifier, on utilise un préfixe
        return key.startsWith(strategy) || this.memoryCache.size > config.maxSize;
      });

    if (strategyKeys.length > config.maxSize) {
      // Supprimer les entrées les plus anciennes
      const sortedKeys = strategyKeys
        .map(key => ({ key, timestamp: this.memoryCache.get(key)?.timestamp || 0 }))
        .sort((a, b) => a.timestamp - b.timestamp);

      const toRemove = sortedKeys.slice(0, sortedKeys.length - config.maxSize);
      toRemove.forEach(({ key }) => {
        this.memoryCache.delete(key);
        localStorage.removeItem(`cache_${key}`);
      });
    }
  }

  private notifyObservers(key: string, data: any) {
    const observers = this.observers.get(key);
    if (observers) {
      observers.forEach(callback => callback(data));
    }
  }

  // Méthodes utilitaires
  size() {
    return this.memoryCache.size;
  }

  clear() {
    this.invalidate();
  }

  stats() {
    return {
      memorySize: this.memoryCache.size,
      observers: this.observers.size,
      strategies: Object.keys(this.strategies)
    };
  }
}

// Instance globale
export const enhancedCache = new EnhancedCache();

// Configuration React Query optimisée
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // Retry intelligent basé sur l'erreur
          if (error?.status === 401 || error?.status === 403) return false;
          if (error?.status >= 500) return failureCount < 3;
          return failureCount < 1;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
};
