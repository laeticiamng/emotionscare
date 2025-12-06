import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

export type SessionClockState = 'idle' | 'running' | 'paused' | 'completed';

export interface UseSessionClockOptions {
  durationMs: number;
  tickMs?: number;
}

export interface SessionClockControls {
  state: SessionClockState;
  elapsedMs: number;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  reset: () => void;
  onTick: (handler: (elapsedMs: number) => void) => () => void;
}

const clampDuration = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.round(value);
};

export function useSessionClock({ durationMs, tickMs = 200 }: UseSessionClockOptions): SessionClockControls {
  const safeDuration = clampDuration(durationMs);
  const [state, setState] = useState<SessionClockState>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [progress, setProgress] = useState(0);

  const rafIntervalRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const tickHandlersRef = useRef(new Set<(elapsedMs: number) => void>());
  const stateRef = useRef<SessionClockState>('idle');
  const durationRef = useRef(safeDuration);
  const tickRef = useRef(tickMs);

  durationRef.current = safeDuration;
  tickRef.current = tickMs;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clearTimer = useCallback(() => {
    if (rafIntervalRef.current !== null) {
      window.clearInterval(rafIntervalRef.current);
      rafIntervalRef.current = null;
    }
  }, []);

  const emitTick = useCallback((value: number) => {
    tickHandlersRef.current.forEach(handler => {
      try {
        handler(value);
      } catch (error) {
        logger.error('SessionClock tick handler failed', { error }, 'BREATH');
      }
    });
  }, []);

  const update = useCallback(() => {
    if (stateRef.current !== 'running' || startTimestampRef.current === null) {
      return;
    }

    const now = performance.now();
    const elapsed = accumulatedRef.current + (now - startTimestampRef.current);
    const clamped = Math.min(durationRef.current, Math.max(0, elapsed));

    setElapsedMs(clamped);
    setProgress(durationRef.current > 0 ? clamped / durationRef.current : 0);
    emitTick(clamped);

    if (clamped >= durationRef.current) {
      // End of session reached.
      startTimestampRef.current = null;
      accumulatedRef.current = durationRef.current;
      setState('completed');
      clearTimer();
    }
  }, [clearTimer, emitTick]);

  const schedule = useCallback(() => {
    clearTimer();
    if (durationRef.current <= 0) {
      return;
    }
    rafIntervalRef.current = window.setInterval(update, Math.max(50, tickRef.current));
  }, [clearTimer, update]);

  useEffect(() => clearTimer, [clearTimer]);

  const start = useCallback(() => {
    accumulatedRef.current = 0;
    startTimestampRef.current = performance.now();
    setElapsedMs(0);
    setProgress(0);
    setState('running');
    emitTick(0);
    schedule();
  }, [emitTick, schedule]);

  const pause = useCallback(() => {
    if (stateRef.current !== 'running') {
      return;
    }

    const now = performance.now();
    if (startTimestampRef.current !== null) {
      const elapsed = accumulatedRef.current + (now - startTimestampRef.current);
      accumulatedRef.current = Math.min(durationRef.current, Math.max(0, elapsed));
      startTimestampRef.current = null;
    }

    setElapsedMs(accumulatedRef.current);
    setProgress(durationRef.current > 0 ? accumulatedRef.current / durationRef.current : 0);
    setState('paused');
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (stateRef.current !== 'paused') {
      return;
    }

    startTimestampRef.current = performance.now();
    setState('running');
    schedule();
  }, [schedule]);

  const complete = useCallback(() => {
    accumulatedRef.current = durationRef.current;
    startTimestampRef.current = null;
    setElapsedMs(durationRef.current);
    setProgress(durationRef.current > 0 ? 1 : 0);
    setState('completed');
    emitTick(durationRef.current);
    clearTimer();
  }, [clearTimer, emitTick]);

  const reset = useCallback(() => {
    clearTimer();
    accumulatedRef.current = 0;
    startTimestampRef.current = null;
    setElapsedMs(0);
    setProgress(0);
    setState('idle');
  }, [clearTimer]);

  const onTick = useCallback((handler: (elapsed: number) => void) => {
    tickHandlersRef.current.add(handler);
    return () => {
      tickHandlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    if (stateRef.current === 'completed') {
      setElapsedMs(durationRef.current);
      setProgress(durationRef.current > 0 ? 1 : 0);
    } else if (stateRef.current === 'idle') {
      setElapsedMs(0);
      setProgress(0);
    } else {
      const clamped = Math.min(durationRef.current, accumulatedRef.current);
      setElapsedMs(clamped);
      setProgress(durationRef.current > 0 ? clamped / durationRef.current : 0);
    }
  }, [safeDuration]);

  return useMemo(() => ({
    state,
    elapsedMs,
    progress,
    start,
    pause,
    resume,
    complete,
    reset,
    onTick,
  }), [state, elapsedMs, progress, start, pause, resume, complete, reset, onTick]);
}
