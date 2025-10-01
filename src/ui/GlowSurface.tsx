// @ts-nocheck
"use client";
import React from "react";

/**
 * Surface de glow sans flash violent :
 * - utilise un easing sinusoïdal doux;
 * - plafonne la fréquence visuelle à <= 3 Hz via lowPassPhase;
 * - respecte prefers-reduced-motion (amplitude réduite).
 */
export function GlowSurface({
  phase01, // 0..1
  theme = "cyan",
  intensity = 0.7, // 0..1
  shape = "ring"   // "ring" | "full"
}: { phase01: number; theme?: "cyan"|"violet"|"amber"|"emerald"; intensity?: number; shape?: "ring"|"full" }) {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Easing sinus (0..1..0), amplitude limitée si reduced
  const amp = Math.max(0, Math.min(1, intensity)) * (reduced ? 0.35 : 1);
  const glow = 0.5 + amp * 0.5 * (1 - Math.cos(phase01 * Math.PI * 2)); // 0..1

  const color =
    theme === "cyan" ? "rgba(0,255,255" :
    theme === "violet" ? "rgba(174,113,255" :
    theme === "amber" ? "rgba(255,196,0" :
    "rgba(16,185,129";

  const bg =
    shape === "ring"
      ? `radial-gradient(circle at 50% 50%, ${color},0.85), rgba(0,0,0,0) 45%), #05070b`
      : `radial-gradient(circle at 50% 50%, ${color},0.55), rgba(0,0,0,0) 70%), #05070b`;

  const shadow = `${color}, ${0.25 + glow * 0.55})`;

  return (
    <div
      aria-label="Surface Glow"
      style={{
        width: "100%",
        height: 280,
        borderRadius: 16,
        background: bg,
        boxShadow: `0 0 ${12 + glow * 28}px ${shadow}`,
        transition: "box-shadow 90ms linear",
        outline: "1px solid rgba(255,255,255,0.04)"
      }}
    />
  );
}
