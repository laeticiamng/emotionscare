"use client";
import { useEffect, useRef, useState } from "react";

export function useTimer(totalMs: number) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);      // en ms
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      if (startedAt.current == null) startedAt.current = now;
      const delta = now - startedAt.current;
      setElapsed((prev) => Math.min(totalMs, prev + delta));
      startedAt.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, totalMs]);

  const start = () => { startedAt.current = null; setRunning(true); };
  const pause = () => { setRunning(false); startedAt.current = null; };
  const reset = () => { setRunning(false); setElapsed(0); startedAt.current = null; };

  const progress = totalMs ? elapsed / totalMs : 0;
  const done = elapsed >= totalMs;

  return { running, start, pause, reset, elapsed, progress, done, totalMs };
}
