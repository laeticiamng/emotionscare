
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortDirection } from '@/components/ui/data-table/SortableTableHead';
import { 
  handleSortCycle, 
  saveSortToSearchParams,
  saveSortToStorage,
  loadSortFromStorage
} from '@/utils/sortUtils';

interface UseSortableTableProps<T> {
  initialField?: T | null;
  initialDirection?: SortDirection;
  storageKey?: string;
  persistInUrl?: boolean;
}

/**
 * A hook for managing sortable table state including URL and localStorage persistence
 */
export function useSortableTable<T>({
  initialField = null,
  initialDirection = null,
  storageKey,
  persistInUrl = true
}: UseSortableTableProps<T> = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Try to load from URL first, then localStorage, then fall back to initial values
  const urlField = persistInUrl ? (searchParams.get('sortField') as T | null) : null;
  const urlDirection = persistInUrl ? (searchParams.get('sortDirection') as SortDirection) : null;
  
  // Load from localStorage if provided a key and not found in URL
  const [storageField, storageDirection] = storageKey && !urlField 
    ? loadSortFromStorage<T>(storageKey)
    : [null, null];
  
  const [sortField, setSortField] = useState<T | null>(
    urlField || storageField || initialField
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    urlDirection || storageDirection || initialDirection
  );
  
  // Handle sorting when a column header is clicked
  const handleSort = useCallback((field: T) => {
    const [newField, newDirection] = handleSortCycle(sortField, sortDirection, field);
    
    setSortField(newField);
    setSortDirection(newDirection);
    
    // Save to URL params if enabled
    if (persistInUrl) {
      const newParams = saveSortToSearchParams(
        searchParams, 
        newField !== null ? String(newField) : null,
        newDirection
      );
      setSearchParams(newParams, { replace: true });
    }
    
    // Save to localStorage if enabled
    if (storageKey) {
      saveSortToStorage(
        storageKey,
        newField !== null ? String(newField) : null,
        newDirection
      );
    }
  }, [sortField, sortDirection, searchParams, setSearchParams, persistInUrl, storageKey]);
  
  // Check if a column is currently sorted
  const isSorted = useCallback((field: T): SortDirection => {
    if (field !== sortField) return null;
    return sortDirection;
  }, [sortField, sortDirection]);
  
  // Initialize from URL or localStorage on mount
  useEffect(() => {
    // Already handled in the useState initializers
  }, []);
  
  return {
    sortField,
    sortDirection,
    handleSort,
    isSorted
  };
}
