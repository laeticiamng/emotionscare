
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortDirection = 'asc' | 'desc' | undefined;

interface UseSortableTableOptions {
  storageKey?: string;
  persistInUrl?: boolean;
  defaultSortField?: string;
  defaultSortDirection?: SortDirection;
}

export const useSortableTable = <T extends string>({
  storageKey,
  persistInUrl = false,
  defaultSortField,
  defaultSortDirection = 'asc'
}: UseSortableTableOptions = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize sort state from URL or localStorage if enabled
  const initializeSort = () => {
    if (persistInUrl) {
      const fieldFromUrl = searchParams.get('sortField');
      const dirFromUrl = searchParams.get('sortDir') as SortDirection;
      
      if (fieldFromUrl) {
        return {
          field: fieldFromUrl as T,
          direction: dirFromUrl || defaultSortDirection
        };
      }
    }
    
    if (storageKey) {
      const savedSort = localStorage.getItem(storageKey);
      if (savedSort) {
        try {
          const { field, direction } = JSON.parse(savedSort);
          return { field: field as T, direction };
        } catch (e) {
          console.error('Error parsing saved sort:', e);
        }
      }
    }
    
    return {
      field: defaultSortField as T | undefined,
      direction: defaultSortDirection
    };
  };
  
  const [sortState, setSortState] = useState(initializeSort);
  
  // Update URL and localStorage when sort changes
  useEffect(() => {
    if (persistInUrl && sortState.field) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('sortField', sortState.field as string);
        if (sortState.direction) {
          newParams.set('sortDir', sortState.direction);
        } else {
          newParams.delete('sortDir');
        }
        return newParams;
      });
    }
    
    if (storageKey && sortState.field) {
      localStorage.setItem(storageKey, JSON.stringify(sortState));
    }
  }, [sortState, persistInUrl, storageKey, setSearchParams]);
  
  // Handle sort toggle
  const handleSort = (field: T) => {
    setSortState(prev => {
      if (prev.field === field) {
        // Cycle through: asc -> desc -> undefined -> asc
        const nextDirection: SortDirection = 
          prev.direction === 'asc' ? 'desc' : 
          prev.direction === 'desc' ? undefined : 'asc';
        
        return {
          field,
          direction: nextDirection
        };
      }
      
      // New field, start with ascending
      return {
        field,
        direction: 'asc'
      };
    });
  };
  
  // Check if a field is sorted
  const isSorted = (field: T): SortDirection => {
    return sortState.field === field ? sortState.direction : undefined;
  };
  
  return {
    sortField: sortState.field,
    sortDirection: sortState.direction,
    handleSort,
    isSorted
  };
};
