"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Horloge de pulse à fréquence sûre (<= 3 Hz).
 * Retourne une phase 0..1 qui boucle à la période (60/bpm).
 */
export function usePulseClock(bpm: number, running: boolean) {
  const SAFE_BPM = Math.max(1, Math.min(180, bpm)); // clamp technique
  const CAP_BPM = Math.min(SAFE_BPM, 180); // bpm musical (mais on cap visuel ensuite)
  const [phase01, setPhase01] = useState(0);
  const raf = useRef(0);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const loop = (t: number) => {
      const prev = last.current ?? t;
      last.current = t;
      const dt = (t - prev) / 1000; // s
      const period = 60 / CAP_BPM;
      setPhase01((prevPhase) => (prevPhase + dt / period) % 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf.current); last.current = null; };
  }, [running, CAP_BPM]);

  return phase01;
}
