// @ts-nocheck
/**
 * Hook générique pour state machine async
 * Pattern : idle → loading → active → ending → success|error
 */

import { useState, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';

type MachineState = 'idle' | 'loading' | 'active' | 'ending' | 'success' | 'error';

interface AsyncMachineConfig<T> {
  run: (signal: AbortSignal) => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  retryLimit?: number;
  timeout?: number;
  backoffMs?: number;
}

interface AsyncMachineReturn<T> {
  state: MachineState;
  isLoading: boolean;
  isActive: boolean;
  result: T | null;
  error: Error | null;
  start: () => Promise<void>;
  stop: () => void;
  retry: () => Promise<void>;
  reset: () => void;
}

export function useAsyncMachine<T = any>({
  run,
  onSuccess,
  onError,
  retryLimit = 1,
  timeout = 30000,
  backoffMs = 1000
}: AsyncMachineConfig<T>): AsyncMachineReturn<T> {
  const [state, setState] = useState<MachineState>('idle');
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const executeRun = useCallback(async (): Promise<void> => {
    cleanup();
    
    setState('loading');
    setError(null);
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Timeout handling
    timeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, timeout);

    try {
      setState('active');
      const runResult = await run(signal);
      
      if (signal.aborted) return;
      
      setState('ending');
      
      // Petite pause pour l'animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (signal.aborted) return;
      
      setResult(runResult);
      setState('success');
      setRetryCount(0);
      onSuccess?.(runResult);
      
    } catch (err) {
      if (signal.aborted) return;
      
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      setError(errorInstance);
      
      // Retry logic avec backoff exponentiel
      if (retryCount < retryLimit && !signal.aborted) {
        const delay = backoffMs * Math.pow(2, retryCount);
        logger.info(`🔄 Retry ${retryCount + 1}/${retryLimit} dans ${delay}ms`, {}, 'SYSTEM');
        
        setTimeout(() => {
          if (!signal.aborted) {
            setRetryCount(prev => prev + 1);
            executeRun();
          }
        }, delay);
      } else {
        setState('error');
        onError?.(errorInstance);
      }
    } finally {
      cleanup();
    }
  }, [run, onSuccess, onError, retryLimit, timeout, backoffMs, retryCount, cleanup]);

  const start = useCallback(async (): Promise<void> => {
    if (state === 'loading' || state === 'active') return;
    await executeRun();
  }, [state, executeRun]);

  const stop = useCallback(() => {
    cleanup();
    setState('idle');
    setError(null);
  }, [cleanup]);

  const retry = useCallback(async (): Promise<void> => {
    setRetryCount(0);
    await executeRun();
  }, [executeRun]);

  const reset = useCallback(() => {
    cleanup();
    setState('idle');
    setResult(null);
    setError(null);
    setRetryCount(0);
  }, [cleanup]);

  return {
    state,
    isLoading: state === 'loading',
    isActive: state === 'active',
    result,
    error,
    start,
    stop,
    retry,
    reset
  };
}