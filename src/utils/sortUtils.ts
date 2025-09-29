
/**
 * Generic sorting utility functions for table components
 */

import { SortDirection } from "@/components/ui/data-table/SortableTableHead";

/**
 * Sort an array of data by a specific field and direction
 * 
 * @param data Array of data to sort
 * @param field Field to sort by
 * @param direction Direction to sort (asc/desc)
 * @returns Sorted array
 */
export function sortData<T extends Record<string, any>>(
  data: T[], 
  field: keyof T | null | string, 
  direction: SortDirection
): T[] {
  // If no sort field or direction, return original array
  if (!field || !direction) return [...data];
  
  return [...data].sort((a, b) => {
    // Handle nested field paths (e.g. "user.name")
    const fieldPath = String(field).split('.');
    
    let valueA = getNestedValue(a, fieldPath);
    let valueB = getNestedValue(b, fieldPath);
    
    // Handle null/undefined values
    if (valueA === null || valueA === undefined) valueA = '';
    if (valueB === null || valueB === undefined) valueB = '';
    
    // String comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Number comparison
    return direction === 'asc' 
      ? (valueA - valueB) 
      : (valueB - valueA);
  });
}

/**
 * Get a value from an object by a nested path
 * 
 * @param obj Object to get value from
 * @param path Path to get value from (e.g. ['user', 'name'])
 * @returns Value at path
 */
function getNestedValue(obj: any, path: string[]): any {
  let current = obj;
  
  for (const key of path) {
    if (current === null || current === undefined) return undefined;
    current = current[key];
  }
  
  return current;
}

/**
 * Handle sort cycling through states (null -> asc -> desc -> null)
 * 
 * @param currentField Current field being sorted
 * @param currentDirection Current sort direction
 * @param field Field clicked
 * @returns New sort state [field, direction]
 */
export function handleSortCycle<T>(
  currentField: T | null,
  currentDirection: SortDirection,
  field: T
): [T | null, SortDirection] {
  let newDirection: SortDirection = 'asc';
  
  // If already sorting by this field, cycle through sort directions
  if (field === currentField) {
    if (currentDirection === 'asc') newDirection = 'desc';
    else if (currentDirection === 'desc') newDirection = null;
    else newDirection = 'asc';
  }
  
  return [newDirection === null ? null : field, newDirection];
}

/**
 * Check if a column is currently sorted
 * 
 * @param currentField Current field being sorted
 * @param field Field to check
 * @param direction Current sort direction
 * @returns Sort direction if sorted, null otherwise
 */
export function isSorted<T>(
  currentField: T | null, 
  field: T, 
  direction: SortDirection
): SortDirection {
  if (field !== currentField) return null;
  return direction;
}

/**
 * Save sort state to search params for URL persistence
 * 
 * @param params Search params object
 * @param field Field being sorted
 * @param direction Sort direction
 */
export function saveSortToSearchParams(
  params: URLSearchParams, 
  field: string | null, 
  direction: SortDirection
): URLSearchParams {
  const newParams = new URLSearchParams(params);
  
  if (field && direction) {
    newParams.set('sortField', field);
    newParams.set('sortDirection', direction);
  } else {
    newParams.delete('sortField');
    newParams.delete('sortDirection');
  }
  
  return newParams;
}

/**
 * Save sort state to localStorage for user persistence
 * 
 * @param key Storage key
 * @param field Field being sorted
 * @param direction Sort direction
 */
export function saveSortToStorage(
  key: string,
  field: string | null,
  direction: SortDirection
): void {
  try {
    if (field && direction) {
      localStorage.setItem(key, JSON.stringify({ field, direction }));
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error saving sort preferences to localStorage:', error);
  }
}

/**
 * Load sort state from localStorage
 * 
 * @param key Storage key
 * @returns [field, direction] or [null, null] if not found
 */
export function loadSortFromStorage(key: string): [string | null, SortDirection] {
  try {
    const savedSort = localStorage.getItem(key);
    if (savedSort) {
      const { field, direction } = JSON.parse(savedSort);
      return [field, direction];
    }
  } catch (error) {
    console.error('Error loading sort preferences from localStorage:', error);
  }
  
  return [null, null];
}
