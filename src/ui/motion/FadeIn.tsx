// @ts-nocheck
"use client";
import React from "react";

export function FadeIn({ children, delay = 0, duration = 220 }: { children: React.ReactNode; delay?: number; duration?: number }) {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const style = prefersReduced
    ? {}
    : { opacity: 0, animation: `fadein ${duration}ms ease ${delay}ms forwards` };
  return (
    <>
      <style jsx>{`
        @keyframes fadein { to { opacity: 1; } }
      `}</style>
      <div style={style}>{children}</div>
    </>
  );
}
