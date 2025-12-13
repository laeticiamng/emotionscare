// @ts-nocheck

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Options de taille de page disponibles */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200] as const;
export type PageSize = typeof PAGE_SIZE_OPTIONS[number];

/** Mode de pagination */
export type PaginationMode = 'client' | 'server' | 'infinite' | 'cursor';

/** Direction du tri */
export type SortDirection = 'asc' | 'desc';

/** Configuration du tri */
export interface SortConfig {
  field: string;
  direction: SortDirection;
}

/** Curseur pour la pagination par curseur */
export interface PaginationCursor {
  value: string;
  direction: 'next' | 'prev';
}

/** Configuration du hook */
export interface UsePaginationProps<T = unknown> {
  defaultPage?: number;
  defaultLimit?: PageSize;
  totalItems?: number;
  mode?: PaginationMode;
  syncWithUrl?: boolean;
  urlParamPrefix?: string;
  preserveScroll?: boolean;
  defaultSort?: SortConfig;
  items?: T[];
  onPageChange?: (page: number, limit: number) => void;
  onSortChange?: (sort: SortConfig) => void;
  onLoadMore?: (cursor?: PaginationCursor) => Promise<void>;
}

/** Résultat du hook */
export interface UsePaginationResult<T = unknown> {
  // État de la page
  page: number;
  limit: PageSize;
  totalPages: number;
  totalItems: number;
  offset: number;

  // Navigation
  setPage: (page: number) => void;
  setLimit: (limit: PageSize) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  goToPage: (page: number) => void;

  // État de navigation
  canNextPage: boolean;
  canPrevPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;

  // Tri
  sort: SortConfig | null;
  setSort: (sort: SortConfig) => void;
  toggleSort: (field: string) => void;

  // Pagination infinie
  loadMore: () => Promise<void>;
  isLoadingMore: boolean;
  hasMore: boolean;

  // Items paginés (pour mode client)
  paginatedItems: T[];

  // Informations d'affichage
  pageRange: number[];
  showingFrom: number;
  showingTo: number;
  pageInfo: string;

  // Utilitaires
  reset: () => void;
  refresh: () => void;
}

/** Générer la plage de pages à afficher */
const generatePageRange = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - halfVisible);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const usePagination = <T = unknown>({
  defaultPage = 1,
  defaultLimit = 25,
  totalItems: externalTotalItems = 0,
  mode = 'server',
  syncWithUrl = true,
  urlParamPrefix = '',
  preserveScroll = false,
  defaultSort,
  items = [],
  onPageChange,
  onSortChange,
  onLoadMore,
}: UsePaginationProps<T>): UsePaginationResult<T> => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Préfixe pour les paramètres URL
  const pageParam = `${urlParamPrefix}page`;
  const limitParam = `${urlParamPrefix}limit`;
  const sortParam = `${urlParamPrefix}sort`;
  const dirParam = `${urlParamPrefix}dir`;

  // Valeurs initiales depuis URL ou par défaut
  const initialPage = syncWithUrl
    ? Number(searchParams.get(pageParam)) || defaultPage
    : defaultPage;
  const initialLimit = syncWithUrl
    ? (Number(searchParams.get(limitParam)) as PageSize) || defaultLimit
    : defaultLimit;

  const [page, setPageInternal] = useState<number>(initialPage);
  const [limit, setLimitInternal] = useState<PageSize>(initialLimit);
  const [sort, setSortInternal] = useState<SortConfig | null>(
    defaultSort || (syncWithUrl && searchParams.get(sortParam)
      ? {
          field: searchParams.get(sortParam)!,
          direction: (searchParams.get(dirParam) as SortDirection) || 'asc'
        }
      : null)
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedPages, setLoadedPages] = useState<number[]>([1]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Total des items (externe ou basé sur les items fournis)
  const totalItems = mode === 'client' ? items.length : externalTotalItems;

  // Calcul du nombre total de pages
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  // Page normalisée dans la plage valide
  const normalizedPage = Math.min(Math.max(1, page), totalPages);

  // Offset pour les requêtes
  const offset = (normalizedPage - 1) * limit;

  // Synchroniser avec l'URL
  useEffect(() => {
    if (!syncWithUrl) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set(pageParam, String(normalizedPage));
    newParams.set(limitParam, String(limit));

    if (sort) {
      newParams.set(sortParam, sort.field);
      newParams.set(dirParam, sort.direction);
    } else {
      newParams.delete(sortParam);
      newParams.delete(dirParam);
    }

    setSearchParams(newParams, { replace: true });
  }, [normalizedPage, limit, sort, syncWithUrl, searchParams, setSearchParams, pageParam, limitParam, sortParam, dirParam]);

  // Notifier le changement de page
  useEffect(() => {
    onPageChange?.(normalizedPage, limit);

    if (!preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [normalizedPage, limit, onPageChange, preserveScroll]);

  // Notifier le changement de tri
  useEffect(() => {
    if (sort) {
      onSortChange?.(sort);
    }
  }, [sort, onSortChange]);

  // Changer de page
  const setPage = useCallback((newPage: number) => {
    setPageInternal(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const goToPage = useCallback((targetPage: number) => {
    setPage(targetPage);
  }, [setPage]);

  // Changer la limite
  const setLimit = useCallback((newLimit: PageSize) => {
    setLimitInternal(newLimit);
    setPageInternal(1);
  }, []);

  // Navigation
  const nextPage = useCallback(() => {
    if (normalizedPage < totalPages) {
      setPageInternal(normalizedPage + 1);
    }
  }, [normalizedPage, totalPages]);

  const prevPage = useCallback(() => {
    if (normalizedPage > 1) {
      setPageInternal(normalizedPage - 1);
    }
  }, [normalizedPage]);

  const firstPage = useCallback(() => {
    setPageInternal(1);
  }, []);

  const lastPage = useCallback(() => {
    setPageInternal(totalPages);
  }, [totalPages]);

  // Tri
  const setSort = useCallback((newSort: SortConfig) => {
    setSortInternal(newSort);
    setPageInternal(1);
  }, []);

  const toggleSort = useCallback((field: string) => {
    setSortInternal(current => {
      if (current?.field === field) {
        return {
          field,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { field, direction: 'asc' };
    });
    setPageInternal(1);
  }, []);

  // Pagination infinie
  const loadMore = useCallback(async () => {
    if (isLoadingMore || normalizedPage >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPageNum = normalizedPage + 1;
      await onLoadMore?.({ value: String(nextPageNum), direction: 'next' });
      setLoadedPages(prev => [...prev, nextPageNum]);
      setPageInternal(nextPageNum);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, normalizedPage, totalPages, onLoadMore]);

  // Items paginés (mode client)
  const paginatedItems = useMemo(() => {
    if (mode !== 'client') return items;

    let sortedItems = [...items];

    // Appliquer le tri
    if (sort) {
      sortedItems.sort((a, b) => {
        const aVal = (a as any)[sort.field];
        const bVal = (b as any)[sort.field];

        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Appliquer la pagination
    return sortedItems.slice(offset, offset + limit);
  }, [items, sort, offset, limit, mode]);

  // Plage de pages visibles
  const pageRange = useMemo(() => {
    return generatePageRange(normalizedPage, totalPages, 5);
  }, [normalizedPage, totalPages]);

  // Informations d'affichage
  const showingFrom = totalItems === 0 ? 0 : offset + 1;
  const showingTo = Math.min(offset + limit, totalItems);
  const pageInfo = `${showingFrom}-${showingTo} sur ${totalItems}`;

  // Réinitialiser
  const reset = useCallback(() => {
    setPageInternal(defaultPage);
    setLimitInternal(defaultLimit);
    setSortInternal(defaultSort || null);
    setLoadedPages([1]);
  }, [defaultPage, defaultLimit, defaultSort]);

  // Rafraîchir
  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return {
    // État de la page
    page: normalizedPage,
    limit,
    totalPages,
    totalItems,
    offset,

    // Navigation
    setPage,
    setLimit,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    goToPage,

    // État de navigation
    canNextPage: normalizedPage < totalPages,
    canPrevPage: normalizedPage > 1,
    isFirstPage: normalizedPage === 1,
    isLastPage: normalizedPage === totalPages,

    // Tri
    sort,
    setSort,
    toggleSort,

    // Pagination infinie
    loadMore,
    isLoadingMore,
    hasMore: normalizedPage < totalPages,

    // Items paginés
    paginatedItems,

    // Informations d'affichage
    pageRange,
    showingFrom,
    showingTo,
    pageInfo,

    // Utilitaires
    reset,
    refresh
  };
};

/** Hook simplifié pour pagination client */
export function useClientPagination<T>(items: T[], pageSize: PageSize = 25) {
  return usePagination<T>({
    mode: 'client',
    items,
    defaultLimit: pageSize,
    syncWithUrl: false
  });
}

/** Hook pour pagination serveur */
export function useServerPagination(
  totalItems: number,
  onPageChange: (page: number, limit: number) => void
) {
  return usePagination({
    mode: 'server',
    totalItems,
    onPageChange
  });
}

export default usePagination;
