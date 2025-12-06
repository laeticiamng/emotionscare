// @ts-nocheck
"use client";
import { useMemo, useRef } from "react";
export function useAudioBus(initial = 0.8) {
  const vol = useRef(initial);
  return useMemo(() => ({
    get volume() { return vol.current; },
    setVolume(v: number) { vol.current = Math.max(0, Math.min(1, v)); }
  }), []);
}
