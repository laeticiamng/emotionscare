// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UsePaginationProps {
  defaultPage?: number;
  defaultLimit?: number;
  totalItems?: number;
  onPageChange?: (page: number, limit: number) => void;
}

interface UsePaginationResult {
  page: number;
  limit: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;
}

export const usePagination = ({
  defaultPage = 1,
  defaultLimit = 25,
  totalItems = 0,
  onPageChange,
}: UsePaginationProps): UsePaginationResult => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL if available
  const initialPage = Number(searchParams.get('page')) || defaultPage;
  const initialLimit = Number(searchParams.get('limit')) || defaultLimit;
  
  const [page, setPageInternal] = useState<number>(initialPage);
  const [limit, setLimitInternal] = useState<number>(initialLimit);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  
  // Ensure page is within valid range
  const normalizedPage = Math.min(Math.max(1, page), totalPages);
  
  // Update URL when page or limit changes
  useEffect(() => {
    searchParams.set('page', String(normalizedPage));
    searchParams.set('limit', String(limit));
    setSearchParams(searchParams, { replace: true });
    
    // Notify parent component if callback provided
    if (onPageChange) {
      onPageChange(normalizedPage, limit);
    }
  }, [normalizedPage, limit, searchParams, setSearchParams, onPageChange]);
  
  // Handle page change
  const setPage = useCallback((newPage: number) => {
    setPageInternal(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);
  
  // Handle limit change
  const setLimit = useCallback((newLimit: number) => {
    setLimitInternal(newLimit);
    setPageInternal(1); // Reset to first page when changing limit
  }, []);
  
  // Navigation helpers
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
  
  return {
    page: normalizedPage,
    limit,
    totalPages,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    canNextPage: normalizedPage < totalPages,
    canPrevPage: normalizedPage > 1
  };
};
