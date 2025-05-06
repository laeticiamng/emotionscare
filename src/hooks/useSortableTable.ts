
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortableTableOptions } from '@/components/dashboard/admin/types/tableTypes';

export type SortDirection = 'asc' | 'desc' | null;

export function useSortableTable<T extends string>(options: SortableTableOptions<T>) {
  const {
    storageKey,
    persistInUrl = false,
    defaultField,
    defaultDirection = null
  } = options;
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize sort state from URL or localStorage or defaults
  const initSortField = (): T | undefined => {
    if (persistInUrl) {
      const urlField = searchParams.get('sort');
      if (urlField) return urlField as T;
    }
    
    if (storageKey) {
      const savedSort = localStorage.getItem(`${storageKey}-field`);
      if (savedSort) return savedSort as T;
    }
    
    return defaultField;
  };
  
  const initSortDirection = (): SortDirection => {
    if (persistInUrl) {
      const urlDirection = searchParams.get('direction');
      if (urlDirection && (urlDirection === 'asc' || urlDirection === 'desc')) {
        return urlDirection as SortDirection;
      }
    }
    
    if (storageKey) {
      const savedDirection = localStorage.getItem(`${storageKey}-direction`);
      if (savedDirection && (savedDirection === 'asc' || savedDirection === 'desc' || savedDirection === 'null')) {
        return savedDirection === 'null' ? null : savedDirection as SortDirection;
      }
    }
    
    return defaultDirection;
  };
  
  const [sortField, setSortField] = useState<T | undefined>(initSortField());
  const [sortDirection, setSortDirection] = useState<SortDirection>(initSortDirection());
  
  // Update storage when sort changes
  useEffect(() => {
    if (sortField) {
      if (storageKey) {
        localStorage.setItem(`${storageKey}-field`, sortField as string);
        localStorage.setItem(`${storageKey}-direction`, sortDirection === null ? 'null' : sortDirection);
      }
      
      if (persistInUrl) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', sortField as string);
        if (sortDirection) {
          newParams.set('direction', sortDirection);
        } else {
          newParams.delete('direction');
        }
        setSearchParams(newParams);
      }
    }
  }, [sortField, sortDirection, storageKey, persistInUrl, searchParams, setSearchParams]);
  
  // Handler for column sort clicks
  const handleSort = useCallback((field: T) => {
    setSortField(prevField => {
      setSortDirection(prevDirection => {
        if (prevField !== field) {
          return 'asc'; // New column, start with ascending
        } else {
          // Toggle through: asc -> desc -> null (if 3-state sorting) -> asc
          if (prevDirection === 'asc') return 'desc';
          if (prevDirection === 'desc') return null;
          return 'asc';
        }
      });
      return field;
    });
  }, []);
  
  // Helper to check if a column is sorted
  const isSorted = useCallback((field: T): SortDirection => {
    return field === sortField ? sortDirection : null;
  }, [sortField, sortDirection]);
  
  return { sortField, sortDirection, handleSort, isSorted };
}
