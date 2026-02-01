/**
 * Hook for system health monitoring
 * Provides real-time health status and metrics
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  database: 'connected' | 'disconnected' | 'slow';
  auth: 'authenticated' | 'anonymous' | 'error';
  network: 'online' | 'offline';
  latency: number;
}

export interface SystemMetrics {
  uptime: number;
  lastError: string | null;
  lastErrorTime: Date | null;
  requestCount: number;
  errorCount: number;
}

export function useSystemHealth() {
  const [status, setStatus] = useState<HealthStatus>({
    overall: 'healthy',
    database: 'connected',
    auth: 'anonymous',
    network: navigator.onLine ? 'online' : 'offline',
    latency: 0,
  });

  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 0,
    lastError: null,
    lastErrorTime: null,
    requestCount: 0,
    errorCount: 0,
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    const startTime = performance.now();

    try {
      // Check database
      const { error: dbError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const latency = Math.round(performance.now() - startTime);

      // Check auth
      const { data: { session } } = await supabase.auth.getSession();

      // Determine database status
      let dbStatus: HealthStatus['database'] = 'connected';
      if (dbError) {
        dbStatus = 'disconnected';
      } else if (latency > 1000) {
        dbStatus = 'slow';
      }

      // Determine overall status
      let overall: HealthStatus['overall'] = 'healthy';
      if (dbStatus === 'disconnected' || !navigator.onLine) {
        overall = 'unhealthy';
      } else if (dbStatus === 'slow' || latency > 500) {
        overall = 'degraded';
      }

      setStatus({
        overall,
        database: dbStatus,
        auth: session ? 'authenticated' : 'anonymous',
        network: navigator.onLine ? 'online' : 'offline',
        latency,
      });

      setMetrics(prev => {
        const appWindow = window as unknown as { __APP_START_TIME__?: number };
        const startTime = appWindow.__APP_START_TIME__ ?? Date.now();
        return {
          ...prev,
          requestCount: prev.requestCount + 1,
          uptime: Math.round((Date.now() - startTime) / 1000),
        };
      });

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        overall: 'unhealthy',
        database: 'disconnected',
      }));

      setMetrics(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        lastErrorTime: new Date(),
      }));
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Check health on mount and periodically
  useEffect(() => {
    // Set app start time if not already set
    if (!(window as unknown as { __APP_START_TIME__?: number }).__APP_START_TIME__) {
      (window as unknown as { __APP_START_TIME__: number }).__APP_START_TIME__ = Date.now();
    }

    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, network: 'online' }));
      checkHealth();
    };

    const handleOffline = () => {
      setStatus(prev => ({ 
        ...prev, 
        network: 'offline',
        overall: 'unhealthy',
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkHealth]);

  return {
    status,
    metrics,
    isChecking,
    checkHealth,
  };
}

export default useSystemHealth;
