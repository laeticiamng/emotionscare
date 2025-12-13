// @ts-nocheck
/**
 * useDebounce - Hooks de debounce et throttle
 * Optimisation des appels de fonctions et valeurs réactives
 */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

/** Options de debounce */
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/** Options de throttle */
export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

/** État du debounce */
export interface DebounceState {
  isPending: boolean;
  callCount: number;
  lastCallTime: number | null;
  lastInvokeTime: number | null;
}

/** Résultat étendu du hook */
export interface DebounceResult<T extends (...args: unknown[]) => unknown> {
  debouncedFn: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
  getState: () => DebounceState;
}

/**
 * Hook de debounce pour les fonctions
 * Retarde l'exécution jusqu'à ce qu'il n'y ait plus d'appels pendant le délai
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 300,
  options?: DebounceOptions
): (...args: Parameters<T>) => void {
  const { leading = false, trailing = true, maxWait } = options || {};

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastInvokeTimeRef = useRef<number>(0);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    };
  }, []);

  return useMemo(() => {
    const invokeFunc = (time: number) => {
      const args = lastArgsRef.current;
      lastArgsRef.current = null;
      lastInvokeTimeRef.current = time;
      if (args) {
        fnRef.current(...args);
      }
    };

    const startTimer = (pendingFunc: () => void, wait: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(pendingFunc, wait);
    };

    const shouldInvoke = (time: number) => {
      const timeSinceLastCall = time - (lastCallTimeRef.current || 0);
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

      return (
        lastCallTimeRef.current === null ||
        timeSinceLastCall >= delay ||
        timeSinceLastCall < 0 ||
        (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
      );
    };

    const timerExpired = () => {
      const time = Date.now();
      if (shouldInvoke(time)) {
        if (trailing && lastArgsRef.current) {
          invokeFunc(time);
        }
        timeoutRef.current = null;
        return;
      }
      const timeSinceLastCall = time - (lastCallTimeRef.current || 0);
      const timeWaiting = delay - timeSinceLastCall;
      startTimer(timerExpired, timeWaiting);
    };

    return (...args: Parameters<T>) => {
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgsRef.current = args;
      lastCallTimeRef.current = time;

      if (isInvoking) {
        if (timeoutRef.current === null) {
          lastInvokeTimeRef.current = time;
          if (leading) {
            fnRef.current(...args);
          }
          startTimer(timerExpired, delay);
          return;
        }
      }
      if (timeoutRef.current === null) {
        startTimer(timerExpired, delay);
      }
    };
  }, [delay, leading, trailing, maxWait]);
}

/**
 * Hook de debounce avec contrôles supplémentaires
 */
export function useDebounceExtended<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
  options?: DebounceOptions
): DebounceResult<T> {
  const { leading = false, trailing = true } = options || {};

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastInvokeTimeRef = useRef<number | null>(null);
  const callCountRef = useRef(0);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const invokeFunc = useCallback(() => {
    const args = lastArgsRef.current;
    lastArgsRef.current = null;
    lastInvokeTimeRef.current = Date.now();
    if (args) {
      fnRef.current(...args);
    }
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    lastArgsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && lastArgsRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      invokeFunc();
    }
  }, [invokeFunc]);

  const pending = useCallback(() => {
    return timeoutRef.current !== null;
  }, []);

  const getState = useCallback((): DebounceState => ({
    isPending: timeoutRef.current !== null,
    callCount: callCountRef.current,
    lastCallTime: lastCallTimeRef.current,
    lastInvokeTime: lastInvokeTimeRef.current
  }), []);

  const debouncedFn = useMemo(() => {
    return (...args: Parameters<T>) => {
      callCountRef.current++;
      lastArgsRef.current = args;
      lastCallTimeRef.current = Date.now();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (leading && !timeoutRef.current) {
        invokeFunc();
      }

      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          invokeFunc();
        }, delay);
      }
    };
  }, [delay, leading, trailing, invokeFunc]);

  return useMemo(() => ({
    debouncedFn,
    cancel,
    flush,
    pending,
    getState
  }), [debouncedFn, cancel, flush, pending, getState]);
}

/**
 * Hook pour debouncer une valeur
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook pour debouncer une valeur avec état
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay = 300
): [T, T, (value: T) => void] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setValueDebounced = useCallback((newValue: T) => {
    setValue(newValue);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebouncedValue(newValue), delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [value, debouncedValue, setValueDebounced];
}

/**
 * Hook de throttle pour les fonctions
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit = 300,
  options?: ThrottleOptions
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options || {};

  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useMemo(() => (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = limit - (now - lastRunRef.current);

    lastArgsRef.current = args;

    if (remaining <= 0 || remaining > limit) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastRunRef.current = now;
      if (leading) fnRef.current(...args);
    } else if (!timeoutRef.current && trailing) {
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        timeoutRef.current = null;
        if (lastArgsRef.current) fnRef.current(...lastArgsRef.current);
      }, remaining);
    }
  }, [limit, leading, trailing]);
}

/**
 * Hook pour throttler une valeur
 */
export function useThrottledValue<T>(value: T, limit = 300): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const remaining = limit - (now - lastRunRef.current);

    if (remaining <= 0) {
      lastRunRef.current = now;
      setThrottledValue(value);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        timeoutRef.current = null;
        setThrottledValue(value);
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Hook pour debouncer un callback avec dépendances
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: unknown[]
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);
  return useDebounce(memoizedCallback, delay);
}

/**
 * Hook pour throttler un callback avec dépendances
 */
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  limit: number,
  deps: unknown[]
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);
  return useThrottle(memoizedCallback, limit);
}

export default useDebounce;
