// @ts-nocheck
"use client";
import React from "react";
import { useRaf } from "./useRaf";

export type Phase = "inhale" | "exhale" | "hold" | "hold2";
export type Pattern = Array<{ phase: Phase; sec: number }>;

export function useBreathPattern(pattern: Pattern, _cycles: number) {
  const [running, setRunning] = React.useState(false);
  const [phaseIndex, setPhaseIndex] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  const [phaseProgress, setPhaseProgress] = React.useState(0);
  const phaseStartRef = React.useRef(0);
  const tick = React.useRef(0);

  const current = React.useRef({
    phase: pattern[0]?.phase || "inhale",
    duration: pattern[0]?.sec ?? 0,
    index: 0,
  });

  React.useEffect(() => {
    setRunning(false);
    setPhaseIndex(0);
    setCycle(0);
    setPhaseProgress(0);
    phaseStartRef.current = performance.now();
    current.current = {
      phase: pattern[0]?.phase ?? "inhale",
      duration: pattern[0]?.sec ?? 0,
      index: 0,
    };
  }, [pattern]);

  useRaf(() => {
    if (!running) return;
    tick.current++;
    const now = performance.now();
    const cur = pattern[phaseIndex];
    if (!cur) return;

    const elapsed = (now - phaseStartRef.current) / 1000;
    const progress = cur.sec > 0 ? Math.min(1, elapsed / cur.sec) : 1;
    setPhaseProgress(prev => (Math.abs(prev - progress) < 0.002 ? prev : progress));
    current.current = { phase: cur.phase, duration: cur.sec, index: phaseIndex };

    if (elapsed >= cur.sec) {
      let nextIndex = phaseIndex + 1;
      if (nextIndex >= pattern.length) {
        nextIndex = 0;
        setCycle(cycleCount => cycleCount + 1);
      }
      phaseStartRef.current = now;
      setPhaseIndex(nextIndex);
      current.current = {
        phase: pattern[nextIndex]?.phase ?? cur.phase,
        duration: pattern[nextIndex]?.sec ?? cur.sec,
        index: nextIndex,
      };
      setPhaseProgress(0);
    }
  }, running);

  const start = React.useCallback(() => {
    setCycle(0);
    setPhaseIndex(0);
    phaseStartRef.current = performance.now();
    setRunning(true);
    setPhaseProgress(0);
    current.current = {
      phase: pattern[0]?.phase ?? "inhale",
      duration: pattern[0]?.sec ?? 0,
      index: 0,
    };
  }, [pattern]);

  const stop = React.useCallback(() => {
    setRunning(false);
    setCycle(0);
    setPhaseIndex(0);
    setPhaseProgress(0);
    phaseStartRef.current = performance.now();
    current.current = {
      phase: pattern[0]?.phase ?? "inhale",
      duration: pattern[0]?.sec ?? 0,
      index: 0,
    };
  }, [pattern]);

  const toggle = React.useCallback(() => {
    if (running) setRunning(false);
    else start();
  }, [running, start]);

  return {
    current: current.current,
    phaseProgress,
    running,
    cycle,
    phaseIndex,
    phaseDuration: pattern[phaseIndex]?.sec ?? 0,
    start,
    stop,
    toggle,
  };
}

