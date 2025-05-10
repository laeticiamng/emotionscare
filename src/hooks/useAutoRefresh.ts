
import { useState, useCallback, useEffect, useRef } from 'react';

interface AutoRefreshOptions {
  defaultEnabled?: boolean;
  defaultInterval?: number;
  onRefresh: () => Promise<any>;
}

export function useAutoRefresh({
  defaultEnabled = false,
  defaultInterval = 60000, // 1 minute
  onRefresh
}: AutoRefreshOptions) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [interval, setInterval] = useState(defaultInterval);
  const [refreshing, setRefreshing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start or stop auto refresh
  const toggleAutoRefresh = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  // Change refresh interval
  const changeInterval = useCallback((ms: number) => {
    setInterval(ms);
  }, []);

  // Perform the refresh
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Auto refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  // Set up the interval when enabled changes
  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const scheduleNextRefresh = () => {
      timeoutRef.current = setTimeout(async () => {
        await refresh();
        scheduleNextRefresh();
      }, interval);
    };

    scheduleNextRefresh();

    // Clean up
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, interval, refresh]);

  return {
    enabled,
    interval,
    refreshing,
    toggleAutoRefresh,
    changeInterval
  };
}
