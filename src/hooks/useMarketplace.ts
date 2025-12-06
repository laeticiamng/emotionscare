/**
 * Hook useMarketplace - Phase 4.3
 * Gestion du marketplace avec cache et pagination
 */

import { useEffect, useState, useCallback } from 'react';
import {
  marketplaceService,
  MarketplaceItem,
  MarketplaceCategory,
  SearchFilters,
  InstalledTheme,
  MarketplaceReview,
} from '@/services/marketplaceService';
import { logger } from '@/lib/logger';

export interface UseMarketplaceOptions {
  autoFetch?: boolean;
  cacheTime?: number;
}

/**
 * Hook pour rechercher des items
 */
export function useMarketplaceSearch(
  filters: SearchFilters = {},
  options: UseMarketplaceOptions = {}
) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(filters.page || 1);

  const search = useCallback(
    async (newFilters?: SearchFilters) => {
      setLoading(true);
      setError(null);

      try {
        const result = await marketplaceService.searchItems({
          ...filters,
          ...newFilters,
          page,
        });

        setItems(result.items);
        setTotal(result.total);

        logger.info(
          'Marketplace search completed',
          { count: result.items.length, total: result.total },
          'MARKETPLACE'
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Marketplace search failed', err as Error, 'MARKETPLACE');
      } finally {
        setLoading(false);
      }
    },
    [filters, page]
  );

  useEffect(() => {
    if (options.autoFetch !== false) {
      search();
    }
  }, [search, options.autoFetch]);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    items,
    total,
    loading,
    error,
    page,
    search,
    nextPage,
    prevPage,
    goToPage,
  };
}

/**
 * Hook pour récupérer un item
 */
export function useMarketplaceItem(itemId: string) {
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await marketplaceService.getItemById(itemId);
        setItem(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to fetch marketplace item', err as Error, 'MARKETPLACE');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetch();
    }
  }, [itemId]);

  return { item, loading, error };
}

/**
 * Hook pour les items featured
 */
export function useFeaturedMarketplaceItems(limit: number = 6) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await marketplaceService.getFeaturedItems(limit);
        setItems(data);
      } catch (err) {
        logger.error('Failed to fetch featured items', err as Error, 'MARKETPLACE');
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [limit]);

  return { items, loading, error };
}

/**
 * Hook pour les items trending
 */
export function useTrendingMarketplaceItems(limit: number = 10) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await marketplaceService.getTrendingItems(limit);
        setItems(data);
      } catch (err) {
        logger.error('Failed to fetch trending items', err as Error, 'MARKETPLACE');
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [limit]);

  return { items, loading, error };
}

/**
 * Hook pour les catégories
 */
export function useMarketplaceCategories() {
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await marketplaceService.getCategories();
        setCategories(data);
      } catch (err) {
        logger.error('Failed to fetch categories', err as Error, 'MARKETPLACE');
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook pour les thèmes installés
 */
export function useInstalledThemes(userId: string | undefined) {
  const [installed, setInstalled] = useState<InstalledTheme[]>([]);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [activeTheme, setActiveTheme] = useState<{
    installed: InstalledTheme;
    item: MarketplaceItem;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await marketplaceService.getUserInstalledThemes(userId);
      setInstalled(data.installed);
      setItems(data.items);
      setActiveTheme(data.activeTheme || null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to fetch installed themes', err as Error, 'MARKETPLACE');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const activateTheme = useCallback(
    async (installedThemeId: string) => {
      try {
        await marketplaceService.activateTheme(userId!, installedThemeId);
        await fetch();
        logger.info('Theme activated', { installedThemeId }, 'MARKETPLACE');
      } catch (err) {
        logger.error('Failed to activate theme', err as Error, 'MARKETPLACE');
      }
    },
    [userId, fetch]
  );

  const installTheme = useCallback(
    async (itemId: string, customColors?: Record<string, string>) => {
      try {
        await marketplaceService.installItem(userId!, itemId, customColors);
        await fetch();
        logger.info('Theme installed', { itemId }, 'MARKETPLACE');
      } catch (err) {
        logger.error('Failed to install theme', err as Error, 'MARKETPLACE');
      }
    },
    [userId, fetch]
  );

  return {
    installed,
    items,
    activeTheme,
    loading,
    error,
    refresh: fetch,
    activateTheme,
    installTheme,
  };
}

/**
 * Hook pour les avis
 */
export function useMarketplaceReviews(itemId: string) {
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await marketplaceService.getItemReviews(itemId);
        setReviews(data);
      } catch (err) {
        logger.error('Failed to fetch reviews', err as Error, 'MARKETPLACE');
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetch();
    }
  }, [itemId]);

  const addReview = useCallback(
    async (userId: string, rating: number, title: string, text: string) => {
      try {
        const newReview = await marketplaceService.addReview(
          userId,
          itemId,
          rating,
          title,
          text
        );
        if (newReview) {
          // Refresh les avis
          const data = await marketplaceService.getItemReviews(itemId);
          setReviews(data);
        }
      } catch (err) {
        logger.error('Failed to add review', err as Error, 'MARKETPLACE');
        throw err;
      }
    },
    [itemId]
  );

  return { reviews, loading, error, addReview };
}

/**
 * Hook pour l'achat
 */
export function useMarketplacePurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = useCallback(async (
    userId: string,
    itemId: string,
    amount: number,
    paymentIntentId?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const result = await marketplaceService.recordPurchase(
        userId,
        itemId,
        amount,
        paymentIntentId
      );

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Purchase failed', err as Error, 'MARKETPLACE');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { purchase, loading, error };
}
