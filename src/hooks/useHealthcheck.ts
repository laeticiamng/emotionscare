import { useEffect, useRef, useCallback } from 'react';
import { useSystemStore, Healthz, HealthState } from '@/store/system.store';

export const useHealthcheck = () => {
  const store = useSystemStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<AbortController | null>(null);

  // Adaptive polling intervals based on current state
  const getPollingInterval = (state: HealthState) => {
    switch (state) {
      case 'online': return 60000; // 60s when all good
      case 'degraded': return 10000; // 10s when degraded
      case 'offline': return 5000; // 5s when offline
      default: return 30000;
    }
  };

  const checkHealth = useCallback(async () => {
    // Check network connectivity first
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      store.updateHealth({ ok: false });
      return;
    }

    // Cancel previous request if still pending
    if (timeoutRef.current) {
      timeoutRef.current.abort();
    }

    timeoutRef.current = new AbortController();
    store.setLoading(true);

    try {
      const response = await fetch('/api/healthz', {
        method: 'GET',
        signal: timeoutRef.current.signal,
        // 3 second timeout
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: Healthz = await response.json();
      store.updateHealth(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled, ignore
      }

      // Fetch failed - mark as offline
      store.updateHealth({ ok: false });
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Start polling with adaptive intervals
  const startPolling = useCallback(() => {
    const scheduleNext = () => {
      const interval = getPollingInterval(store.healthState);
      intervalRef.current = setTimeout(() => {
        checkHealth().then(() => {
          // Schedule next check if not cancelled
          if (intervalRef.current) {
            scheduleNext();
          }
        });
      }, interval);
    };

    scheduleNext();
  }, [checkHealth, store.healthState]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      timeoutRef.current.abort();
      timeoutRef.current = null;
    }
  }, []);

  // Setup polling and cleanup
  useEffect(() => {
    // Initial check
    checkHealth();
    
    // Start polling
    startPolling();

    // Handle online/offline events
    const handleOnline = () => checkHealth();
    const handleOffline = () => store.updateHealth({ ok: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle visibility change (pause when tab hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        checkHealth();
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkHealth, startPolling, stopPolling, store]);

  // Restart polling when health state changes (for adaptive intervals)
  useEffect(() => {
    stopPolling();
    startPolling();
  }, [store.healthState, startPolling, stopPolling]);

  // Manual refresh (e.g., on hover or click)
  const refresh = useCallback(() => {
    checkHealth();
    
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'health_view');
    }
  }, [checkHealth]);

  return {
    state: store.healthState,
    version: store.version,
    services: store.services,
    lastChecked: store.lastChecked,
    loading: store.loading,
    refresh,
  };
};