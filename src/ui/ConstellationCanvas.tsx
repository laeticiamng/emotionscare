"use client";
import React, { useEffect, useRef } from "react";
import { useRaf } from "@/COMPONENTS.reg";

type Props = {
  phase: "inhale" | "exhale" | "hold" | "hold2";
  phaseProgress: number; // 0..1
  reduced?: boolean;
  density?: number; // 0..1
};

type Star = { x: number; y: number; vx: number; vy: number; r: number };

export function ConstellationCanvas({ phase, phaseProgress, reduced = false, density = 0.8 }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const tRef = useRef(0);

  // init étoiles
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = cvs.getBoundingClientRect();
      cvs.width = Math.round(rect.width * dpr);
      cvs.height = Math.round(rect.height * dpr);
      ctx.scale(dpr, dpr);
      // régénérer les étoiles selon la densité et la taille
      const area = rect.width * rect.height;
      const count = Math.max(12, Math.min(220, Math.round((area / 4500) * density)));
      starsRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 0.8 + Math.random() * 1.8,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);
    return () => ro.disconnect();
  }, [density]);

  // rendu
  useRaf(
    (t) => {
      const cvs = ref.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;
      const w = cvs.clientWidth,
        h = cvs.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // facteur respiratoire : zoom / lueur / lien
      let breathe = 1;
      if (!reduced) {
        breathe =
          phase === "inhale"
            ? 0.9 + 0.2 * phaseProgress
            : phase === "exhale"
            ? 1.1 - 0.2 * phaseProgress
            : 1.0;
      }

      // déplacement lent
      const stars = starsRef.current;
      if (!reduced) {
        for (const s of stars) {
          s.x += s.vx * (0.5 + 0.5 * breathe);
          s.y += s.vy * (0.5 + 0.5 * breathe);
          if (s.x < 0) s.x += w;
          else if (s.x > w) s.x -= w;
          if (s.y < 0) s.y += h;
          else if (s.y > h) s.y -= h;
        }
      }

      // dessiner
      ctx.save();
      ctx.globalAlpha = 0.9;
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * breathe, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fill();
      }

      // relier les proches (distance modulée par la respiration)
      const linkDist = 60 * breathe;
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i],
            b = stars[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            ctx.globalAlpha = Math.max(0.05, 0.35 - (Math.sqrt(d2) / linkDist) * 0.35);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      tRef.current = t;
    },
    true
  );

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        borderRadius: 12,
        overflow: "hidden",
        background: "linear-gradient(180deg, #0c0f1a, #161b2b)",
      }}
    >
      <canvas
        ref={ref}
        style={{ width: "100%", height: "100%", display: "block" }}
        aria-label="Constellation respiratoire"
      />
    </div>
  );
}

