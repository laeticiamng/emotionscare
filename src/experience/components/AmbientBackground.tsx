/**
 * Experience Layer — AmbientBackground
 * Adaptive background that renders CSS gradients (low/medium tier)
 * or a lightweight Canvas (high tier + immersion >= 2).
 *
 * Fixed, behind all content, pointer-events-none.
 * Reacts to mood, time-of-day, and breathing phase.
 */

import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../store/experience.store';
import { cn } from '@/lib/utils';

/**
 * CSS-only ambient background with animated gradients.
 * Zero Canvas, zero WebGL — pure CSS performance.
 */
const CSSAmbientBackground = memo(function CSSAmbientBackground() {
  const palette = useExperienceStore((s) => s.ambient.palette);
  const motionIntensity = useExperienceStore((s) => s.ambient.motionIntensity);
  const lightIntensity = useExperienceStore((s) => s.ambient.lightIntensity);
  const immersionLevel = useExperienceStore((s) => s.currentImmersionLevel);

  const animationDuration = useMemo(() => {
    if (motionIntensity === 0) return '0s';
    return `${Math.max(6, 12 - motionIntensity * 6)}s`;
  }, [motionIntensity]);

  if (immersionLevel === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Base gradient — mood colored */}
      <div
        className="absolute inset-0 transition-all duration-[1200ms] ease-in-out"
        style={{
          background: `
            radial-gradient(
              ellipse 120% 80% at 30% 20%,
              ${palette.primary}${Math.round(lightIntensity * 0.08 * 255).toString(16).padStart(2, '0')},
              transparent 60%
            ),
            radial-gradient(
              ellipse 100% 60% at 70% 80%,
              ${palette.secondary}${Math.round(lightIntensity * 0.06 * 255).toString(16).padStart(2, '0')},
              transparent 50%
            )
          `,
        }}
      />

      {/* Breathing glow — for immersion >= 2 */}
      {immersionLevel >= 2 && motionIntensity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 60% 60% at 50% 50%,
                ${palette.glow}08,
                transparent 70%
              )
            `,
            animation: motionIntensity > 0
              ? `ambient-breathe ${animationDuration} ease-in-out infinite`
              : 'none',
          }}
        />
      )}

      {/* Subtle noise texture for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
    </motion.div>
  );
});

/**
 * AmbientBackground — Main export
 * Renders CSS-only background. Canvas mode can be added later
 * for high-tier devices via lazy import.
 */
export function AmbientBackground() {
  const immersionLevel = useExperienceStore((s) => s.currentImmersionLevel);

  return (
    <AnimatePresence mode="wait">
      {immersionLevel > 0 && <CSSAmbientBackground key="ambient-bg" />}
    </AnimatePresence>
  );
}
