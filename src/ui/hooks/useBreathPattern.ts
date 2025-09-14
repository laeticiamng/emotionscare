"use client";
import React from "react";
import { useRaf } from "./useRaf";

export type Phase = "inhale" | "exhale" | "hold" | "hold2";
export type Pattern = Array<{ phase: Phase; sec: number }>;

export function useBreathPattern(pattern: Pattern, _cycles: number) {
  const [running, setRunning] = React.useState(false);
  const [phaseIndex, setPhaseIndex] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  const [phaseStart, setPhaseStart] = React.useState(0);
  const tick = React.useRef(0);

  const current = React.useRef({ phase: pattern[0]?.phase || "inhale" });

  useRaf(() => {
    if (!running) return;
    tick.current++;
    const now = performance.now();
    const elapsed = (now - phaseStart) / 1000;
    const cur = pattern[phaseIndex];
    if (elapsed >= cur.sec) {
      let nextIndex = phaseIndex + 1;
      if (nextIndex >= pattern.length) {
        nextIndex = 0;
        setCycle(c => c + 1);
      }
      setPhaseIndex(nextIndex);
      setPhaseStart(now);
      current.current = { phase: pattern[nextIndex].phase };
    } else {
      current.current = { phase: cur.phase };
    }
  }, running);

  const phaseProgress = running
    ? Math.min(1, (performance.now() - phaseStart) / (pattern[phaseIndex].sec * 1000))
    : 0;

  const start = React.useCallback(() => {
    setCycle(0);
    setPhaseIndex(0);
    setPhaseStart(performance.now());
    setRunning(true);
    current.current = { phase: pattern[0].phase };
  }, [pattern]);

  const stop = React.useCallback(() => {
    setRunning(false);
    setCycle(0);
    setPhaseIndex(0);
  }, []);

  const toggle = React.useCallback(() => {
    if (running) setRunning(false);
    else start();
  }, [running, start]);

  return {
    current: current.current,
    phaseProgress,
    running,
    cycle,
    start,
    stop,
    toggle,
  };
}

