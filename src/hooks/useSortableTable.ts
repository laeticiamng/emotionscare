
import { useState, useCallback } from 'react';
import { SortableField } from '@/components/dashboard/admin/types/tableTypes';

type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  field: SortableField | null;
  direction: SortDirection;
}

export function useSortableTable<T>(initialData: T[], initialSort?: SortState) {
  const [sortState, setSortState] = useState<SortState>(initialSort || {
    field: null,
    direction: null,
  });
  
  const [data, setData] = useState<T[]>(initialData);
  
  // Callback to handle sorting
  const handleSort = useCallback((field: SortableField) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
            ? null
            : 'asc'
          : 'asc',
    }));
  }, []);
  
  // Helper to check sort state for a given field
  const isSorted = useCallback(
    (field: SortableField) => {
      return sortState.field === field ? sortState.direction : null;
    },
    [sortState]
  );
  
  // Update data when source data or sort state changes
  const updateData = useCallback((newData: T[]) => {
    if (sortState.field && sortState.direction) {
      const sortedData = [...newData].sort((a, b) => {
        const fieldA = a[sortState.field as keyof T];
        const fieldB = b[sortState.field as keyof T];
        
        // Safe comparison that handles different types
        const compareValues = (valA: any, valB: any): number => {
          // Handle null/undefined values
          if (valA == null && valB == null) return 0;
          if (valA == null) return -1;
          if (valB == null) return 1;
          
          // Handle string comparison
          if (typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB);
          }
          
          // Handle number comparison
          if (typeof valA === 'number' && typeof valB === 'number') {
            return valA - valB;
          }
          
          // Convert to string for any other type
          return String(valA).localeCompare(String(valB));
        };
        
        const result = compareValues(fieldA, fieldB);
        return sortState.direction === 'asc' ? result : -result;
      });
      
      setData(sortedData);
    } else {
      setData(newData);
    }
  }, [sortState]);
  
  // For compatibility with existing code using sortField and sortDirection
  const sortField = sortState.field;
  const sortDirection = sortState.direction;
  
  return { 
    data, 
    sortState, 
    handleSort, 
    isSorted, 
    updateData,
    // Add these for backward compatibility
    sortField,
    sortDirection
  };
}

export default useSortableTable;
