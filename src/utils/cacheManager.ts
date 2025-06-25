
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100;

  // Ajouter un élément au cache
  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    // Nettoyer le cache si trop volumineux
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000, // Convertir en millisecondes
    });
  }

  // Récupérer un élément du cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Vérifier si l'élément a expiré
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // Supprimer un élément du cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Nettoyer les éléments expirés
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Vider complètement le cache
  clear(): void {
    this.cache.clear();
  }

  // Obtenir les statistiques du cache
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }

  // Précharger des données critiques
  async preload(key: string, dataLoader: () => Promise<any>, ttlMinutes: number = 10) {
    try {
      const data = await dataLoader();
      this.set(key, data, ttlMinutes);
      console.log(`✅ Preloaded cache for: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to preload cache for: ${key}`, error);
    }
  }
}

// Instance globale du cache
export const cacheManager = new CacheManager();

// Hook React pour utiliser le cache
export const useCache = <T>(key: string, dataLoader: () => Promise<T>, ttlMinutes: number = 5) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier le cache d'abord
        const cachedData = cacheManager.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Charger les données si pas en cache
        const freshData = await dataLoader();
        cacheManager.set(key, freshData, ttlMinutes);
        setData(freshData);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, ttlMinutes]);

  const refetch = React.useCallback(async () => {
    cacheManager.delete(key);
    const freshData = await dataLoader();
    cacheManager.set(key, freshData, ttlMinutes);
    setData(freshData);
  }, [key, dataLoader, ttlMinutes]);

  return { data, loading, error, refetch };
};
