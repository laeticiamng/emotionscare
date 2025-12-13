// @ts-nocheck
/**
 * useThrottle - Hook de throttle pour limiter les appels de fonction
 * Optimisation des performances avec limitation de fréquence
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Options de throttle */
export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/** État du throttle */
export interface ThrottleState {
  isPending: boolean;
  lastCallTime: number | null;
  lastInvokeTime: number | null;
  callCount: number;
  invokeCount: number;
}

/** Résultat étendu du hook */
export interface ThrottleResult<T extends (...args: unknown[]) => unknown> {
  throttledFn: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
  getState: () => ThrottleState;
}

/** Configuration du throttle */
export interface ThrottleConfig {
  defaultInterval: number;
  defaultLeading: boolean;
  defaultTrailing: boolean;
  trackStats: boolean;
}

// Configuration par défaut
const DEFAULT_CONFIG: ThrottleConfig = {
  defaultInterval: 300,
  defaultLeading: true,
  defaultTrailing: true,
  trackStats: false
};

/**
 * Hook de throttle basique
 * Limite les appels à une fois par intervalle
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  interval = 300,
  options?: ThrottleOptions
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options || {};

  const lastRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const fnRef = useRef(fn);

  // Mettre à jour la référence de la fonction
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    const invokeFunc = () => {
      const args = lastArgsRef.current;
      lastArgsRef.current = null;
      if (args) {
        fnRef.current(...args);
      }
    };

    return (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = interval - (now - lastRef.current);

      lastArgsRef.current = args;

      if (remaining <= 0 || remaining > interval) {
        // Nettoyer le timeout existant
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        lastRef.current = now;

        if (leading) {
          fnRef.current(...args);
        }
      } else if (!timeoutRef.current && trailing) {
        // Planifier l'exécution trailing
        timeoutRef.current = setTimeout(() => {
          lastRef.current = Date.now();
          timeoutRef.current = null;
          invokeFunc();
        }, remaining);
      }
    };
  }, [interval, leading, trailing]);
}

/**
 * Hook de throttle avec contrôles étendus
 */
export function useThrottleExtended<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval = 300,
  options?: ThrottleOptions
): ThrottleResult<T> {
  const { leading = true, trailing = true, maxWait } = options || {};

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastInvokeTimeRef = useRef<number | null>(null);
  const callCountRef = useRef(0);
  const invokeCountRef = useRef(0);
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

  const invokeFunc = useCallback(() => {
    const args = lastArgsRef.current;
    lastArgsRef.current = null;
    lastInvokeTimeRef.current = Date.now();
    invokeCountRef.current++;

    if (args) {
      fnRef.current(...args);
    }
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
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

  const getState = useCallback((): ThrottleState => ({
    isPending: timeoutRef.current !== null,
    lastCallTime: lastCallTimeRef.current,
    lastInvokeTime: lastInvokeTimeRef.current,
    callCount: callCountRef.current,
    invokeCount: invokeCountRef.current
  }), []);

  const throttledFn = useMemo(() => {
    return (...args: Parameters<T>) => {
      const now = Date.now();
      callCountRef.current++;
      lastArgsRef.current = args;
      lastCallTimeRef.current = now;

      const timeSinceLastInvoke = lastInvokeTimeRef.current
        ? now - lastInvokeTimeRef.current
        : interval;

      const shouldInvoke = timeSinceLastInvoke >= interval;

      if (shouldInvoke) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (leading) {
          invokeFunc();
        } else if (trailing) {
          timeoutRef.current = setTimeout(invokeFunc, interval);
        }

        // Configurer maxWait
        if (maxWait && !maxTimeoutRef.current) {
          maxTimeoutRef.current = setTimeout(() => {
            maxTimeoutRef.current = null;
            if (lastArgsRef.current) {
              invokeFunc();
            }
          }, maxWait);
        }
      } else if (!timeoutRef.current && trailing) {
        const remaining = interval - timeSinceLastInvoke;
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          invokeFunc();
        }, remaining);
      }
    };
  }, [interval, leading, trailing, maxWait, invokeFunc]);

  return useMemo(() => ({
    throttledFn,
    cancel,
    flush,
    pending,
    getState
  }), [throttledFn, cancel, flush, pending, getState]);
}

/**
 * Hook pour throttler une valeur
 */
export function useThrottledValue<T>(value: T, interval = 300): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;
    const now = Date.now();
    const remaining = interval - (now - lastRef.current);

    if (remaining <= 0) {
      lastRef.current = now;
      setThrottledValue(value);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastRef.current = Date.now();
        timeoutRef.current = null;
        setThrottledValue(latestValueRef.current);
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}

/**
 * Hook pour throttler un état
 * Retourne [valeurImmediate, valeurThrottled, setValue]
 */
export function useThrottledState<T>(
  initialValue: T,
  interval = 300
): [T, T, (value: T) => void] {
  const [value, setValue] = useState(initialValue);
  const [throttledValue, setThrottledValue] = useState(initialValue);
  const lastRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestValueRef = useRef(initialValue);

  const setValueThrottled = useCallback((newValue: T) => {
    setValue(newValue);
    latestValueRef.current = newValue;

    const now = Date.now();
    const remaining = interval - (now - lastRef.current);

    if (remaining <= 0) {
      lastRef.current = now;
      setThrottledValue(newValue);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastRef.current = Date.now();
        timeoutRef.current = null;
        setThrottledValue(latestValueRef.current);
      }, remaining);
    }
  }, [interval]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, throttledValue, setValueThrottled];
}

/**
 * Hook pour throttler un callback avec dépendances
 */
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  interval: number,
  deps: unknown[]
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);
  return useThrottle(memoizedCallback, interval);
}

/**
 * Hook pour limiter les événements (ex: scroll, resize)
 */
export function useThrottledEvent<K extends keyof WindowEventMap>(
  eventType: K,
  handler: (event: WindowEventMap[K]) => void,
  interval = 100,
  options?: AddEventListenerOptions
): void {
  const throttledHandler = useThrottle(handler, interval);

  useEffect(() => {
    window.addEventListener(eventType, throttledHandler, options);
    return () => {
      window.removeEventListener(eventType, throttledHandler, options);
    };
  }, [eventType, throttledHandler, options]);
}

/**
 * Hook pour throttler les requêtes de frame d'animation
 */
export function useThrottledAnimationFrame(
  callback: (timestamp: number) => void,
  fps = 60
): {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
} {
  const [isRunning, setIsRunning] = useState(false);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const frameInterval = useMemo(() => 1000 / fps, [fps]);

  const animate = useCallback((timestamp: number) => {
    if (timestamp - lastFrameTimeRef.current >= frameInterval) {
      lastFrameTimeRef.current = timestamp;
      callbackRef.current(timestamp);
    }
    frameRef.current = requestAnimationFrame(animate);
  }, [frameInterval]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      lastFrameTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, animate]);

  const stop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return { start, stop, isRunning };
}

/**
 * Hook combiné throttle + debounce
 * Throttle au début, debounce à la fin
 */
export function useThrottleDebounce<T extends (...args: unknown[]) => void>(
  fn: T,
  throttleMs = 100,
  debounceMs = 300
): (...args: Parameters<T>) => void {
  const lastRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => (...args: Parameters<T>) => {
    const now = Date.now();

    // Annuler le debounce précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Throttle: exécuter immédiatement si assez de temps s'est écoulé
    if (now - lastRef.current >= throttleMs) {
      lastRef.current = now;
      fnRef.current(...args);
    }

    // Debounce: planifier une exécution finale
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      fnRef.current(...args);
    }, debounceMs);
  }, [throttleMs, debounceMs]);
}

export default useThrottle;
