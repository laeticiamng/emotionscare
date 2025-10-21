// @ts-nocheck

import { useState, useEffect, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseAutoRefreshOptions {
  onRefresh: () => Promise<any>;
  defaultEnabled?: boolean;
  defaultInterval?: number;
  intervals?: number[];
}

export function useAutoRefresh({
  onRefresh,
  defaultEnabled = false,
  defaultInterval = 60000, // 1 minute default
  intervals = [30000, 60000, 300000, 600000] // 30s, 1m, 5m, 10m
}: UseAutoRefreshOptions) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [interval, setInterval] = useState(defaultInterval);
  const [refreshing, setRefreshing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Toggle auto-refresh on/off
  const toggleAutoRefresh = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);
  
  // Change refresh interval
  const changeInterval = useCallback((newInterval: number) => {
    setInterval(newInterval);
  }, []);
  
  // Execute refresh
  const executeRefresh = useCallback(async () => {
    if (!enabled) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      logger.error('Auto-refresh failed', error as Error, 'SYSTEM');
    } finally {
      setRefreshing(false);
    }
  }, [enabled, onRefresh]);
  
  // Set up auto-refresh timer
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (enabled) {
      timeoutRef.current = setTimeout(async () => {
        await executeRefresh();
        // Schedule next refresh
        timeoutRef.current = setTimeout(() => executeRefresh(), interval);
      }, interval);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, interval, executeRefresh]);
  
  // Manually trigger refresh
  const refresh = useCallback(async () => {
    return executeRefresh();
  }, [executeRefresh]);
  
  return {
    enabled,
    interval,
    refreshing,
    intervals,
    toggleAutoRefresh,
    changeInterval,
    refresh
  };
}
