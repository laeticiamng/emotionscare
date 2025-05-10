import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAutoRefreshOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
  onRefresh?: () => Promise<any>;
  immediate?: boolean;
}

export function useAutoRefresh({
  interval = 60000, // default 1 minute
  enabled = true,
  onRefresh,
  immediate = false,
}: UseAutoRefreshOptions = {}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to keep track of the timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const refresh = useCallback(async () => {
    if (isRefreshing || !onRefresh) return;
    
    setIsRefreshing(true);
    setError(null);
    
    try {
      await onRefresh();
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error during refresh'));
      console.error('Error during auto-refresh:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh]);
  
  // Start or stop the auto-refresh timer
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // If enabled, start a new timer
    if (enabled && interval > 0) {
      // Run immediately if requested
      if (immediate) {
        refresh();
      }
      
      // Set up the interval
      timerRef.current = setInterval(() => {
        refresh();
      }, interval);
    }
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, interval, refresh, immediate]);
  
  return {
    isRefreshing,
    lastRefreshed,
    error,
    refresh,
    setEnabled: (value: boolean) => {
      // This would need to be implemented with additional state if needed
    }
  };
}

export default useAutoRefresh;
