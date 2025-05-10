
import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAutoRefreshOptions {
  onRefresh: () => Promise<any>;
  defaultEnabled?: boolean;
  defaultInterval?: number;
}

interface UseAutoRefreshResult {
  enabled: boolean;
  interval: number;
  refreshing: boolean;
  lastRefreshed: Date;
  error: Error | null;
  toggleAutoRefresh: () => void;
  changeInterval: (newInterval: number) => void;
  refresh: () => Promise<any>;
  setEnabled: (value: boolean) => void;
  isRefreshing: boolean;
}

export function useAutoRefresh({
  onRefresh,
  defaultEnabled = false,
  defaultInterval = 60000, // 1 minute
}: UseAutoRefreshOptions): UseAutoRefreshResult {
  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);
  const [interval, setInterval] = useState<number>(defaultInterval);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [error, setError] = useState<Error | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to refresh data
  const refresh = useCallback(async () => {
    if (refreshing) return;
    
    try {
      setRefreshing(true);
      setError(null);
      await onRefresh();
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      console.error('Auto refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);
  
  // Toggle auto refresh feature
  const toggleAutoRefresh = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);
  
  // Change interval duration
  const changeInterval = useCallback((newInterval: number) => {
    setInterval(newInterval);
  }, []);
  
  // Set up or clear the timer when enabled or interval changes
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (enabled) {
      timerRef.current = setInterval(refresh, interval);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, interval, refresh]);
  
  return {
    enabled,
    interval,
    refreshing,
    lastRefreshed,
    error,
    toggleAutoRefresh,
    changeInterval,
    refresh,
    setEnabled,
    isRefreshing: refreshing,
  };
}

export default useAutoRefresh;
