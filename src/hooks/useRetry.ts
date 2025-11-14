import { useState, useCallback, useRef } from 'react';

export interface RetryOptions {
  maxRetries?: number;
  backoff?: 'linear' | 'exponential';
  baseDelay?: number; // ms
  maxDelay?: number; // ms
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

export interface RetryState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isRetrying: boolean;
  retryCount: number;
  execute: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'shouldRetry'>> = {
  maxRetries: 3,
  backoff: 'exponential',
  baseDelay: 1000,
  maxDelay: 10000,
};

/**
 * Hook pour exécuter une fonction asynchrone avec retry automatique
 *
 * @example
 * ```tsx
 * const { data, error, isLoading, execute, retryCount } = useRetry(
 *   async () => {
 *     const result = await supabase.functions.invoke('emotion-scan');
 *     return result.data;
 *   },
 *   {
 *     maxRetries: 3,
 *     backoff: 'exponential',
 *     onRetry: (attempt, error) => {
 *       console.log(`Retry ${attempt}:`, error);
 *     }
 *   }
 * );
 * ```
 */
export function useRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): RetryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const opts = { ...DEFAULT_OPTIONS, ...options };

  const calculateDelay = useCallback(
    (attempt: number): number => {
      let delay: number;

      if (opts.backoff === 'exponential') {
        delay = opts.baseDelay * Math.pow(2, attempt);
      } else {
        delay = opts.baseDelay * (attempt + 1);
      }

      return Math.min(delay, opts.maxDelay);
    },
    [opts.backoff, opts.baseDelay, opts.maxDelay]
  );

  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const execute = useCallback(async () => {
    // Annuler l'exécution précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const controller = abortControllerRef.current;

    setIsLoading(true);
    setError(null);
    setRetryCount(0);

    let attempt = 0;

    while (attempt <= opts.maxRetries) {
      try {
        // Vérifier si l'opération a été annulée
        if (controller.signal.aborted) {
          throw new Error('Operation aborted');
        }

        const result = await fn();

        // Succès
        setData(result);
        setError(null);
        setIsLoading(false);
        setIsRetrying(false);
        return;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        // Si c'est une annulation, sortir immédiatement
        if (controller.signal.aborted || error.message === 'Operation aborted') {
          setIsLoading(false);
          setIsRetrying(false);
          return;
        }

        // Vérifier si on doit retry
        const shouldRetry = options.shouldRetry ? options.shouldRetry(error) : true;

        if (!shouldRetry || attempt >= opts.maxRetries) {
          // Échec définitif
          setError(error);
          setData(null);
          setIsLoading(false);
          setIsRetrying(false);
          setRetryCount(attempt);
          return;
        }

        // Retry
        attempt++;
        setRetryCount(attempt);
        setIsRetrying(true);

        // Callback de retry
        options.onRetry?.(attempt, error);

        // Attendre avant de retry
        const delay = calculateDelay(attempt - 1);
        await sleep(delay);
      }
    }
  }, [fn, opts.maxRetries, calculateDelay, options]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRetrying(false);
    setRetryCount(0);
  }, []);

  return {
    data,
    error,
    isLoading,
    isRetrying,
    retryCount,
    execute,
    reset,
  };
}

/**
 * Hook simplifié pour retry une fonction une seule fois
 */
export function useRetryOnce<T>(
  fn: () => Promise<T>
): {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: () => Promise<void>;
} {
  const { data, error, isLoading, execute } = useRetry(fn, { maxRetries: 1 });
  return { data, error, isLoading, execute };
}

/**
 * Wrapper pour retry une fonction async directement (sans hook)
 *
 * @example
 * ```tsx
 * const result = await retryAsync(
 *   () => fetch('/api/scan'),
 *   { maxRetries: 3, backoff: 'exponential' }
 * );
 * ```
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let attempt = 0;

  const calculateDelay = (attempt: number): number => {
    let delay: number;
    if (opts.backoff === 'exponential') {
      delay = opts.baseDelay * Math.pow(2, attempt);
    } else {
      delay = opts.baseDelay * (attempt + 1);
    }
    return Math.min(delay, opts.maxDelay);
  };

  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  while (attempt <= opts.maxRetries) {
    try {
      return await fn();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      const shouldRetry = options.shouldRetry ? options.shouldRetry(error) : true;

      if (!shouldRetry || attempt >= opts.maxRetries) {
        throw error;
      }

      attempt++;
      options.onRetry?.(attempt, error);

      const delay = calculateDelay(attempt - 1);
      await sleep(delay);
    }
  }

  throw new Error('Max retries exceeded');
}
