// @ts-nocheck
import { useState, useCallback } from 'react';

export type AsyncState = "idle" | "loading" | "active" | "ending" | "success" | "error";

export interface AsyncMachineOptions<T> {
  run: (signal: AbortSignal) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  timeoutMs?: number;
  retry?: 1 | 2;
}

export function useAsyncMachine<T>(options: AsyncMachineOptions<T>) {
  const [state, setState] = useState<AsyncState>("idle");
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<unknown>();

  const runOnce = useCallback(async () => {
    setState("loading");
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), options.timeoutMs ?? 15000);
    
    let attempt = 0;
    const maxRetries = options.retry ?? 1;
    
    try {
      while (attempt <= maxRetries) {
        try {
          setState("active");
          const result = await options.run(abortController.signal);
          
          setData(result);
          setState("success");
          options.onSuccess?.(result);
          break;
        } catch (err) {
          if (attempt >= maxRetries) {
            throw err;
          }
          
          attempt++;
          // Exponential backoff: 300ms, 600ms, 1200ms
          await new Promise(resolve => setTimeout(resolve, 300 * attempt));
        }
      }
    } catch (err) {
      setError(err);
      setState("error");
      options.onError?.(err);
    } finally {
      clearTimeout(timeout);
      if (state === "active") {
        setState("ending");
      }
    }
  }, [options, state]);

  const reset = useCallback(() => {
    setState("idle");
    setData(undefined);
    setError(undefined);
  }, []);

  return {
    state,
    data,
    error,
    runOnce,
    reset,
    isLoading: state === "loading" || state === "active",
    isSuccess: state === "success",
    isError: state === "error"
  };
}