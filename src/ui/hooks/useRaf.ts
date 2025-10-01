// @ts-nocheck
"use client";
import { useEffect, useRef } from "react";

export function useRaf(cb: (t: number) => void, enabled = true) {
  const ref = useRef<((t: number) => void) | null>(null);
  ref.current = cb;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const loop = (t: number) => {
      ref.current?.(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);
}

