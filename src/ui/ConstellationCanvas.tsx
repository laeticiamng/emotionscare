"use client";
import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useRaf } from "@/ui/hooks/useRaf";

type Props = {
  phase: "inhale" | "exhale" | "hold" | "hold2";
  phaseProgress: number; // 0..1
  phaseDuration?: number;
  reduced?: boolean;
  density?: number; // 0..1
};

type Star = { x: number; y: number; vx: number; vy: number; r: number };

const BASE_BACKGROUND = "linear-gradient(180deg, #0c0f1a 0%, #161b2b 100%)";

export function ConstellationCanvas({
  phase,
  phaseProgress,
  phaseDuration = 0,
  reduced = false,
  density = 0.8,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);

  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reduced || Boolean(prefersReducedMotion);

  const scaleMotion = useMotionValue(1);
  const glowMotion = useMotionValue(0.45);

  const scaleRef = useRef(scaleMotion.get());
  const glowRef = useRef(glowMotion.get());

  useEffect(() => {
    const unsubscribeScale = scaleMotion.on("change", value => {
      scaleRef.current = value;
    });
    const unsubscribeGlow = glowMotion.on("change", value => {
      glowRef.current = value;
    });
    return () => {
      unsubscribeScale();
      unsubscribeGlow();
    };
  }, [scaleMotion, glowMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = rect.width * rect.height;
      const count = Math.max(12, Math.min(220, Math.round((area / 4500) * density)));
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 0.8 + Math.random() * 1.8,
      }));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [density]);

  useEffect(() => {
    if (shouldReduceMotion) {
      scaleMotion.set(1);
      glowMotion.set(0.3);
      return;
    }

    const amplitude = 0.18;
    const holdOffset = amplitude * 0.4;
    const duration = Math.max(0.35, phaseDuration || 0.9);

    const scaleTarget =
      phase === "inhale"
        ? 1 + amplitude
        : phase === "exhale"
        ? 1 - amplitude
        : 1 + holdOffset;

    const glowTarget =
      phase === "inhale"
        ? 0.75
        : phase === "exhale"
        ? 0.4
        : 0.55;

    const scaleControls = animate(scaleMotion, scaleTarget, {
      duration,
      ease: "easeInOut",
    });

    const glowControls = animate(glowMotion, glowTarget, {
      duration,
      ease: "easeInOut",
    });

    return () => {
      scaleControls.stop();
      glowControls.stop();
    };
  }, [phase, phaseDuration, scaleMotion, glowMotion, shouldReduceMotion]);

  const overlayScale = useTransform(scaleMotion, value => 1 + (value - 1) * 0.6);
  const containerShadow = useTransform(
    glowMotion,
    value => `0 0 ${30 + value * 70}px rgba(90, 128, 255, ${0.1 + value * 0.25})`
  );
  const auraOpacity = useTransform(glowMotion, value => 0.25 + value * 0.5);

  useRaf(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const stars = starsRef.current;
    const breathe = shouldReduceMotion ? 1 : scaleRef.current;
    const glowLevel = shouldReduceMotion ? 0.3 : glowRef.current;
    const progress = Math.min(1, Math.max(0, phaseProgress));
    const progressWave = shouldReduceMotion ? 0 : Math.sin(progress * Math.PI);

    if (!shouldReduceMotion) {
      const velocityBoost = 0.5 + Math.abs(breathe - 1) * 1.1 + progressWave * 0.4;
      for (const star of stars) {
        star.x += star.vx * velocityBoost;
        star.y += star.vy * velocityBoost;
        if (star.x < 0) star.x += width;
        else if (star.x > width) star.x -= width;
        if (star.y < 0) star.y += height;
        else if (star.y > height) star.y -= height;
      }
    }

    ctx.save();
    const starAlpha = shouldReduceMotion ? 0.6 : Math.min(0.95, 0.55 + glowLevel * 0.5);
    ctx.globalAlpha = starAlpha;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    for (const star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * breathe, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    const linkDistance = 60 * breathe;
    const baseLinkAlpha = shouldReduceMotion ? 0.12 : 0.16 + glowLevel * 0.18 + progressWave * 0.08;
    ctx.lineWidth = shouldReduceMotion ? 0.4 : 0.6;
    ctx.strokeStyle = "rgba(200,210,255,0.8)";

    // ⚡ PERFORMANCE OPTIMIZATION: Spatial hash grid reduces O(n²) to O(n)
    // Instead of comparing all stars (48,400 comparisons for 220 stars),
    // we only compare stars in nearby grid cells (~10-20 comparisons per star)
    const cellSize = linkDistance;
    const grid = new Map<string, Star[]>();

    // Build spatial hash grid
    for (const star of stars) {
      const cellX = Math.floor(star.x / cellSize);
      const cellY = Math.floor(star.y / cellSize);
      const key = `${cellX},${cellY}`;
      if (!grid.has(key)) {
        grid.set(key, []);
      }
      grid.get(key)!.push(star);
    }

    // Draw links only between stars in adjacent cells
    const drawnPairs = new Set<string>();
    for (const star of stars) {
      const cellX = Math.floor(star.x / cellSize);
      const cellY = Math.floor(star.y / cellSize);

      // Check this cell and 8 adjacent cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborKey = `${cellX + dx},${cellY + dy}`;
          const neighbors = grid.get(neighborKey);
          if (!neighbors) continue;

          for (const neighbor of neighbors) {
            // Skip self and already drawn pairs
            if (star === neighbor) continue;

            const pairKey = star.x < neighbor.x || (star.x === neighbor.x && star.y < neighbor.y)
              ? `${star.x},${star.y}-${neighbor.x},${neighbor.y}`
              : `${neighbor.x},${neighbor.y}-${star.x},${star.y}`;

            if (drawnPairs.has(pairKey)) continue;
            drawnPairs.add(pairKey);

            const dx = star.x - neighbor.x;
            const dy = star.y - neighbor.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < linkDistance * linkDistance) {
              const intensity = Math.max(0.05, baseLinkAlpha * (1 - Math.sqrt(dist2) / linkDistance));
              ctx.globalAlpha = intensity;
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(neighbor.x, neighbor.y);
              ctx.stroke();
            }
          }
        }
      }
    }
    ctx.restore();
  }, true);

  return (
    <motion.div
      style={{
        width: "100%",
        height: 300,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        background: BASE_BACKGROUND,
        boxShadow: shouldReduceMotion ? "0 0 22px rgba(28, 40, 76, 0.45)" : containerShadow,
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: -60,
          background:
            "radial-gradient(circle at 30% 20%, rgba(99,132,255,0.25), transparent 60%)," +
            "radial-gradient(circle at 70% 70%, rgba(58,88,180,0.2), transparent 65%)",
          opacity: shouldReduceMotion ? 0.18 : auraOpacity,
          filter: "blur(60px)",
          scale: shouldReduceMotion ? 1 : overlayScale,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        aria-label="Constellation respiratoire"
      />
    </motion.div>
  );
}
