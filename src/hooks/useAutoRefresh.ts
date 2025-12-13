// @ts-nocheck

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { logger } from '@/lib/logger';

/** Stratégie de rafraîchissement */
export type RefreshStrategy = 'interval' | 'exponential' | 'adaptive' | 'visibility';

/** État du rafraîchissement */
export type RefreshState = 'idle' | 'refreshing' | 'success' | 'error' | 'paused';

/** Configuration du backoff exponentiel */
export interface BackoffConfig {
  initialInterval: number;
  maxInterval: number;
  multiplier: number;
  resetOnSuccess: boolean;
}

/** Statistiques de rafraîchissement */
export interface RefreshStats {
  totalRefreshes: number;
  successfulRefreshes: number;
  failedRefreshes: number;
  lastRefreshTime: Date | null;
  lastSuccessTime: Date | null;
  lastErrorTime: Date | null;
  lastError: Error | null;
  averageRefreshDuration: number;
  consecutiveFailures: number;
}

/** Conditions de rafraîchissement */
export interface RefreshConditions {
  onlyWhenVisible?: boolean;
  onlyWhenOnline?: boolean;
  onlyWhenFocused?: boolean;
  minTimeBetweenRefreshes?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/** Configuration avancée */
export interface UseAutoRefreshOptions {
  onRefresh: () => Promise<any>;
  defaultEnabled?: boolean;
  defaultInterval?: number;
  intervals?: number[];
  strategy?: RefreshStrategy;
  backoff?: Partial<BackoffConfig>;
  conditions?: RefreshConditions;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: RefreshState) => void;
  enableStats?: boolean;
  persistEnabled?: boolean;
  storageKey?: string;
}

const DEFAULT_BACKOFF: BackoffConfig = {
  initialInterval: 5000,
  maxInterval: 300000, // 5 minutes
  multiplier: 2,
  resetOnSuccess: true
};

const DEFAULT_CONDITIONS: RefreshConditions = {
  onlyWhenVisible: true,
  onlyWhenOnline: true,
  onlyWhenFocused: false,
  minTimeBetweenRefreshes: 1000,
  maxRetries: 3,
  retryDelay: 1000
};

export function useAutoRefresh({
  onRefresh,
  defaultEnabled = false,
  defaultInterval = 60000,
  intervals = [30000, 60000, 300000, 600000],
  strategy = 'interval',
  backoff: backoffConfig,
  conditions: conditionsConfig,
  onSuccess,
  onError,
  onStateChange,
  enableStats = true,
  persistEnabled = false,
  storageKey = 'auto-refresh-enabled'
}: UseAutoRefreshOptions) {
  const backoff = { ...DEFAULT_BACKOFF, ...backoffConfig };
  const conditions = { ...DEFAULT_CONDITIONS, ...conditionsConfig };

  // État initial depuis le storage
  const [enabled, setEnabled] = useState(() => {
    if (!persistEnabled || typeof window === 'undefined') return defaultEnabled;
    const stored = localStorage.getItem(storageKey);
    return stored !== null ? stored === 'true' : defaultEnabled;
  });

  const [interval, setIntervalState] = useState(defaultInterval);
  const [state, setState] = useState<RefreshState>('idle');
  const [currentInterval, setCurrentInterval] = useState(defaultInterval);
  const [isVisible, setIsVisible] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isFocused, setIsFocused] = useState(true);

  // Statistiques
  const [stats, setStats] = useState<RefreshStats>({
    totalRefreshes: 0,
    successfulRefreshes: 0,
    failedRefreshes: 0,
    lastRefreshTime: null,
    lastSuccessTime: null,
    lastErrorTime: null,
    lastError: null,
    averageRefreshDuration: 0,
    consecutiveFailures: 0
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);
  const refreshDurationsRef = useRef<number[]>([]);

  // Persister enabled
  useEffect(() => {
    if (persistEnabled && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(enabled));
    }
  }, [enabled, persistEnabled, storageKey]);

  // Notifier le changement d'état
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Détecter la visibilité
  useEffect(() => {
    if (!conditions.onlyWhenVisible) return;

    const handleVisibility = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [conditions.onlyWhenVisible]);

  // Détecter la connexion
  useEffect(() => {
    if (!conditions.onlyWhenOnline) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [conditions.onlyWhenOnline]);

  // Détecter le focus
  useEffect(() => {
    if (!conditions.onlyWhenFocused) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [conditions.onlyWhenFocused]);

  // Vérifier les conditions
  const canRefresh = useMemo(() => {
    if (!enabled) return false;
    if (conditions.onlyWhenVisible && !isVisible) return false;
    if (conditions.onlyWhenOnline && !isOnline) return false;
    if (conditions.onlyWhenFocused && !isFocused) return false;

    const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
    if (timeSinceLastRefresh < (conditions.minTimeBetweenRefreshes || 0)) return false;

    return true;
  }, [enabled, isVisible, isOnline, isFocused, conditions]);

  // Calculer le prochain intervalle
  const getNextInterval = useCallback(() => {
    switch (strategy) {
      case 'exponential':
        const nextExp = Math.min(
          currentInterval * backoff.multiplier,
          backoff.maxInterval
        );
        return nextExp;

      case 'adaptive':
        // Augmenter l'intervalle si erreurs, réduire si succès consécutifs
        if (stats.consecutiveFailures > 0) {
          return Math.min(currentInterval * 1.5, backoff.maxInterval);
        } else if (stats.successfulRefreshes > 3 && stats.failedRefreshes === 0) {
          return Math.max(currentInterval * 0.8, backoff.initialInterval);
        }
        return currentInterval;

      case 'visibility':
        // Rafraîchir immédiatement quand la page devient visible
        return isVisible ? interval : interval * 3;

      default:
        return interval;
    }
  }, [strategy, currentInterval, backoff, stats, isVisible, interval]);

  // Exécuter le rafraîchissement
  const executeRefresh = useCallback(async (isRetry = false) => {
    if (!canRefresh && !isRetry) return null;

    const startTime = Date.now();
    lastRefreshRef.current = startTime;
    setState('refreshing');

    try {
      const result = await onRefresh();

      const duration = Date.now() - startTime;
      refreshDurationsRef.current.push(duration);
      if (refreshDurationsRef.current.length > 10) {
        refreshDurationsRef.current.shift();
      }

      const avgDuration = refreshDurationsRef.current.reduce((a, b) => a + b, 0) / refreshDurationsRef.current.length;

      setStats(prev => ({
        ...prev,
        totalRefreshes: prev.totalRefreshes + 1,
        successfulRefreshes: prev.successfulRefreshes + 1,
        lastRefreshTime: new Date(startTime),
        lastSuccessTime: new Date(),
        consecutiveFailures: 0,
        averageRefreshDuration: avgDuration,
        lastError: null
      }));

      retryCountRef.current = 0;

      if (backoff.resetOnSuccess && strategy === 'exponential') {
        setCurrentInterval(backoff.initialInterval);
      }

      setState('success');
      onSuccess?.(result);

      return result;
    } catch (error) {
      const err = error as Error;

      setStats(prev => ({
        ...prev,
        totalRefreshes: prev.totalRefreshes + 1,
        failedRefreshes: prev.failedRefreshes + 1,
        lastRefreshTime: new Date(startTime),
        lastErrorTime: new Date(),
        consecutiveFailures: prev.consecutiveFailures + 1,
        lastError: err
      }));

      logger.error('Auto-refresh failed', err, 'SYSTEM');
      setState('error');
      onError?.(err);

      // Retry logic
      if (retryCountRef.current < (conditions.maxRetries || 0)) {
        retryCountRef.current++;
        setTimeout(() => executeRefresh(true), conditions.retryDelay || 1000);
      } else {
        retryCountRef.current = 0;
        setCurrentInterval(getNextInterval());
      }

      return null;
    }
  }, [canRefresh, onRefresh, onSuccess, onError, backoff, strategy, conditions, getNextInterval]);

  // Timer de rafraîchissement
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!enabled) {
      setState('idle');
      return;
    }

    if (state === 'paused') return;

    const scheduleNext = () => {
      const nextInterval = getNextInterval();
      setCurrentInterval(nextInterval);

      timeoutRef.current = setTimeout(async () => {
        await executeRefresh();
        scheduleNext();
      }, nextInterval);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, state, getNextInterval, executeRefresh]);

  // Actions
  const toggleAutoRefresh = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const enable = useCallback(() => setEnabled(true), []);
  const disable = useCallback(() => setEnabled(false), []);

  const changeInterval = useCallback((newInterval: number) => {
    setIntervalState(newInterval);
    setCurrentInterval(newInterval);
  }, []);

  const pause = useCallback(() => {
    setState('paused');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    setState('idle');
  }, []);

  const refresh = useCallback(async () => {
    return executeRefresh();
  }, [executeRefresh]);

  const resetStats = useCallback(() => {
    setStats({
      totalRefreshes: 0,
      successfulRefreshes: 0,
      failedRefreshes: 0,
      lastRefreshTime: null,
      lastSuccessTime: null,
      lastErrorTime: null,
      lastError: null,
      averageRefreshDuration: 0,
      consecutiveFailures: 0
    });
    refreshDurationsRef.current = [];
    retryCountRef.current = 0;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Temps avant prochain rafraîchissement
  const timeUntilNextRefresh = useMemo(() => {
    if (!enabled || state === 'paused') return null;
    const elapsed = Date.now() - lastRefreshRef.current;
    return Math.max(0, currentInterval - elapsed);
  }, [enabled, state, currentInterval]);

  return {
    // État
    enabled,
    interval,
    currentInterval,
    state,
    refreshing: state === 'refreshing',
    intervals,

    // Conditions
    isVisible,
    isOnline,
    isFocused,
    canRefresh,

    // Actions
    toggleAutoRefresh,
    enable,
    disable,
    changeInterval,
    pause,
    resume,
    refresh,

    // Stats
    stats: enableStats ? stats : null,
    resetStats,

    // Infos
    timeUntilNextRefresh,
    strategy
  };
}

/** Hook simplifié pour visibilité */
export function useRefreshOnVisible(onRefresh: () => Promise<any>) {
  return useAutoRefresh({
    onRefresh,
    strategy: 'visibility',
    defaultEnabled: true,
    conditions: { onlyWhenVisible: true }
  });
}

/** Hook avec backoff exponentiel */
export function useExponentialRefresh(
  onRefresh: () => Promise<any>,
  initialInterval: number = 5000
) {
  return useAutoRefresh({
    onRefresh,
    strategy: 'exponential',
    defaultEnabled: true,
    defaultInterval: initialInterval,
    backoff: { initialInterval, resetOnSuccess: true }
  });
}

export default useAutoRefresh;
