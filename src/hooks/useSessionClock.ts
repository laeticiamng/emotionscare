// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SessionState = 'idle' | 'running' | 'paused' | 'completed';

export interface UseSessionClockOptions {
  durationMs: number;
  tickMs?: number;
  autoPauseOnHidden?: boolean;
  onTick?: (elapsedMs: number) => void;
}

export interface SessionClock {
  state: SessionState;
  elapsedMs: number;
  progress: number;
  remainingMs: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: (finalElapsedMs?: number) => void;
  reset: () => void;
}

const getNow = (): number => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }

  return Date.now();
};

const clampDuration = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.max(0, Math.round(value));
};

export function useSessionClock({
  durationMs,
  tickMs = 1000,
  autoPauseOnHidden = true,
  onTick,
}: UseSessionClockOptions): SessionClock {
  const duration = useMemo(() => clampDuration(durationMs), [durationMs]);
  const tickInterval = useMemo(() => (tickMs <= 0 ? 1000 : Math.round(tickMs)), [tickMs]);

  const [state, setState] = useState<SessionState>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const baselineElapsedRef = useRef(0);
  const stateRef = useRef<SessionState>('idle');
  const onTickRef = useRef<typeof onTick>();
  onTickRef.current = onTick;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clampElapsed = useCallback((value: number) => {
    if (!Number.isFinite(value) || value <= 0) {
      return 0;
    }

    if (duration === 0) {
      return 0;
    }

    return Math.min(duration, Math.max(0, Math.round(value)));
  }, [duration]);

  const computeElapsed = useCallback(() => {
    if (stateRef.current !== 'running') {
      return clampElapsed(baselineElapsedRef.current);
    }

    const startTs = startTimestampRef.current;
    if (startTs === null) {
      return clampElapsed(baselineElapsedRef.current);
    }

    const delta = getNow() - startTs;
    return clampElapsed(baselineElapsedRef.current + delta);
  }, [clampElapsed]);

  const setElapsedSafely = useCallback((nextElapsed: number, markComplete = false, updateBaseline = false) => {
    const clamped = clampElapsed(nextElapsed);
    const shouldUpdateBaseline = updateBaseline || stateRef.current !== 'running' || markComplete;

    if (shouldUpdateBaseline) {
      baselineElapsedRef.current = clamped;
    }

    setElapsedMs(clamped);

    if (onTickRef.current) {
      onTickRef.current(clamped);
    }

    if ((markComplete || clamped >= duration) && stateRef.current !== 'completed') {
      baselineElapsedRef.current = clamped;
      stateRef.current = 'completed';
      setState('completed');
      startTimestampRef.current = null;
      clearTimer();
    }
  }, [clampElapsed, clearTimer, duration]);

  const start = useCallback(() => {
    clearTimer();
    baselineElapsedRef.current = 0;
    startTimestampRef.current = getNow();
    stateRef.current = 'running';
    setState('running');
    setElapsedMs(0);
  }, [clearTimer]);

  const pause = useCallback(() => {
    if (stateRef.current !== 'running') {
      return;
    }

    const current = computeElapsed();
    clearTimer();
    startTimestampRef.current = null;
    stateRef.current = 'paused';
    setState('paused');
    setElapsedSafely(current, false, true);
  }, [clearTimer, computeElapsed, setElapsedSafely]);

  const resume = useCallback(() => {
    if (stateRef.current !== 'paused') {
      return;
    }

    startTimestampRef.current = getNow();
    stateRef.current = 'running';
    setState('running');
  }, []);

  const complete = useCallback((finalElapsedMs?: number) => {
    const elapsed = typeof finalElapsedMs === 'number'
      ? clampElapsed(finalElapsedMs)
      : computeElapsed();

    clearTimer();
    startTimestampRef.current = null;
    stateRef.current = 'completed';
    setState('completed');
    setElapsedSafely(elapsed, true, true);
  }, [clampElapsed, clearTimer, computeElapsed, setElapsedSafely]);

  const reset = useCallback(() => {
    clearTimer();
    baselineElapsedRef.current = 0;
    startTimestampRef.current = null;
    stateRef.current = 'idle';
    setState('idle');
    setElapsedMs(0);
  }, [clearTimer]);

  useEffect(() => {
    if (stateRef.current !== 'running') {
      clearTimer();
      return undefined;
    }

    const id = setInterval(() => {
      const current = computeElapsed();
      if (stateRef.current === 'running') {
        setElapsedSafely(current);
      }
    }, tickInterval);

    intervalRef.current = id;

    return () => {
      clearInterval(id);
      if (intervalRef.current === id) {
        intervalRef.current = null;
      }
    };
  }, [computeElapsed, setElapsedSafely, tickInterval, clearTimer, state]);

  useEffect(() => {
    if (!autoPauseOnHidden) {
      return undefined;
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && stateRef.current === 'running') {
        pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [autoPauseOnHidden, pause]);

  useEffect(() => {
    if (duration === 0) {
      clearTimer();
      baselineElapsedRef.current = 0;
      startTimestampRef.current = null;
      stateRef.current = 'completed';
      setState('completed');
      setElapsedMs(0);
    } else if (elapsedMs > duration) {
      setElapsedSafely(elapsedMs);
    }
  }, [duration, elapsedMs, setElapsedSafely, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const progress = useMemo(() => {
    if (duration === 0) {
      return 1;
    }

    return Math.max(0, Math.min(1, elapsedMs / duration));
  }, [elapsedMs, duration]);

  const remainingMs = useMemo(() => {
    if (duration === 0) {
      return 0;
    }

    return Math.max(0, duration - elapsedMs);
  }, [duration, elapsedMs]);

  return {
    state,
    elapsedMs,
    progress,
    remainingMs,
    start,
    pause,
    resume,
    complete,
    reset,
  };
}

