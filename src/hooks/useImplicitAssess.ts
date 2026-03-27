// @ts-nocheck
import { useCallback, useEffect, useRef } from 'react';
import { trackImplicitAssess, type ImplicitSignal } from '@/lib/implicitAssess';

export function useImplicitAssess() {
  const startTimeRef = useRef<number>(Date.now());

  const track = useCallback((signal: Omit<ImplicitSignal, 'ts'>) => {
    trackImplicitAssess({ ...signal, ts: Date.now() });
  }, []);

  const trackDuration = useCallback((signal: Omit<ImplicitSignal, 'proxy' | 'value' | 'ts'>) => {
    const duration = Date.now() - startTimeRef.current;
    trackImplicitAssess({
      ...signal,
      proxy: 'duration',
      value: duration,
      ts: Date.now()
    });
  }, []);

  const trackChoice = useCallback((signal: Omit<ImplicitSignal, 'proxy' | 'ts'>) => {
    trackImplicitAssess({
      ...signal,
      proxy: 'choice',
      ts: Date.now()
    });
  }, []);

  const trackRepeat = useCallback((signal: Omit<ImplicitSignal, 'proxy' | 'value' | 'ts'>) => {
    trackImplicitAssess({
      ...signal,
      proxy: 'repeat',
      value: 'repeated',
      ts: Date.now()
    });
  }, []);

  const trackSkip = useCallback((signal: Omit<ImplicitSignal, 'proxy' | 'value' | 'ts'>) => {
    trackImplicitAssess({
      ...signal,
      proxy: 'skip',
      value: 'skipped',
      ts: Date.now()
    });
  }, []);

  const trackCadence = useCallback((signal: Omit<ImplicitSignal, 'proxy' | 'ts'>) => {
    trackImplicitAssess({
      ...signal,
      proxy: 'cadence_followed',
      ts: Date.now()
    });
  }, []);

  const trackCompletion = useCallback((signal: Omit<ImplicitSignal, 'proxy' | 'ts'>) => {
    trackImplicitAssess({
      ...signal,
      proxy: 'completion',
      ts: Date.now()
    });
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  return {
    track,
    trackDuration,
    trackChoice,
    trackRepeat,
    trackSkip,
    trackCadence,
    trackCompletion
  };
}
