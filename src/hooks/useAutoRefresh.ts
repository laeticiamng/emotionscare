
import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAutoRefreshOptions {
  onRefresh: () => void;
  defaultEnabled?: boolean;
  defaultInterval?: number;
}

export function useAutoRefresh({ 
  onRefresh, 
  defaultEnabled = false, 
  defaultInterval = 60000 
}: UseAutoRefreshOptions) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [interval, setInterval] = useState(defaultInterval);
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Handle the refresh
  const handleRefresh = useCallback(async () => {
    try {
      if (refreshing) return;
      setRefreshing(true);
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);
  
  // Toggle auto refresh
  const toggleAutoRefresh = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);
  
  // Change interval
  const changeInterval = useCallback((value: number) => {
    setInterval(value);
  }, []);
  
  // Set up or clear the interval based on enabled status
  useEffect(() => {
    if (enabled) {
      handleRefresh();
      timerRef.current = setInterval(handleRefresh, interval);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, interval, handleRefresh]);
  
  return {
    enabled,
    interval,
    refreshing,
    toggleAutoRefresh,
    changeInterval,
    refresh: handleRefresh
  };
}
