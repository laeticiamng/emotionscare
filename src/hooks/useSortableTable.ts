// @ts-nocheck

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortDirection } from '@/components/dashboard/admin/types/tableTypes';

interface SortableTableOptions<T extends string> {
  storageKey?: string;
  persistInUrl?: boolean;
  defaultField: T;
  defaultDirection: SortDirection;
}

export function useSortableTable<T extends string>({
  storageKey,
  persistInUrl = false,
  defaultField,
  defaultDirection = 'asc'
}: SortableTableOptions<T>) {
  // URL state management
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL or localStorage or defaults
  const initField = (): T => {
    if (persistInUrl) {
      const urlField = searchParams.get('sortField');
      if (urlField) return urlField as T;
    }
    
    if (storageKey) {
      const savedSort = localStorage.getItem(storageKey);
      if (savedSort) {
        const { field } = JSON.parse(savedSort);
        if (field) return field as T;
      }
    }
    
    return defaultField;
  };
  
  const initDirection = (): SortDirection => {
    if (persistInUrl) {
      const urlDirection = searchParams.get('sortDir');
      if (urlDirection && (urlDirection === 'asc' || urlDirection === 'desc')) {
        return urlDirection;
      }
    }
    
    if (storageKey) {
      const savedSort = localStorage.getItem(storageKey);
      if (savedSort) {
        const { direction } = JSON.parse(savedSort);
        if (direction) return direction as SortDirection;
      }
    }
    
    return defaultDirection;
  };
  
  // State for current sorting
  const [sortField, setSortField] = useState<T>(initField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initDirection);
  
  // Save sorting when it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify({ field: sortField, direction: sortDirection }));
    }
    
    if (persistInUrl) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('sortField', sortField);
        newParams.set('sortDir', sortDirection || 'asc');
        return newParams;
      });
    }
  }, [sortField, sortDirection, storageKey, persistInUrl, setSearchParams]);
  
  // Handle sort request
  const handleSort = useCallback((field: T) => {
    setSortField(prevField => {
      if (prevField === field) {
        // Toggle direction if same field
        setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
        return field;
      } else {
        // Default to ascending for new field
        setSortDirection('asc');
        return field;
      }
    });
  }, []);
  
  // Check if a column is sorted
  const isSorted = useCallback((field: T): SortDirection => {
    return sortField === field ? sortDirection : null;
  }, [sortField, sortDirection]);
  
  return {
    sortField,
    sortDirection,
    handleSort,
    isSorted
  };
}
