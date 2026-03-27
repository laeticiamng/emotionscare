// @ts-nocheck
/**
 * Experience Layer — ProgressionAura
 * Visual ambient indicator of progression that replaces flat percentage bars.
 * The space "illuminates" as progress increases.
 *
 * 0%  = dim, low glow
 * 50% = moderate glow, subtle pulse
 * 100% = full illumination, celebration pulse
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExperienceStore } from '../store/experience.store';

interface ProgressionAuraProps {
  /** Progress value 0-100 */
  progress: number;
  /** Optional label */
  label?: string;
  /** Compact mode for inline usage */
  compact?: boolean;
  className?: string;
}

export function ProgressionAura({
  progress,
  label,
  compact = false,
  className,
}: ProgressionAuraProps) {
  const palette = useExperienceStore((s) => s.ambient.palette);
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);

  const clampedProgress = Math.max(0, Math.min(100, progress));
  const normalizedProgress = clampedProgress / 100;
  const isComplete = clampedProgress >= 100;

  const glowOpacity = 0.03 + normalizedProgress * 0.12;
  const pulseIntensity = isComplete ? 1.08 : 1 + normalizedProgress * 0.03;

  return (
    <div className={cn('relative', compact ? 'inline-flex items-center gap-2' : 'p-4 rounded-2xl', className)}>
      {/* Aura glow */}
      {!compact && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none -z-1"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${palette.primary}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
          }}
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, pulseIntensity, 1],
                  opacity: [0.8, 1, 0.8],
                }
          }
          transition={{
            duration: isComplete ? 2 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content */}
      <div className={cn('relative z-10', compact ? 'flex items-center gap-2' : 'text-center space-y-2')}>
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}

        {/* Circular indicator */}
        <div className={cn('relative', compact ? 'w-8 h-8' : 'w-16 h-16 mx-auto')}>
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/30"
            />
            {/* Progress arc */}
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={palette.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${normalizedProgress * 97.4} 97.4`}
              initial={{ strokeDasharray: '0 97.4' }}
              animate={{ strokeDasharray: `${normalizedProgress * 97.4} 97.4` }}
              transition={{ duration: reducedMotion ? 0.2 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                filter: isComplete ? `drop-shadow(0 0 4px ${palette.glow})` : undefined,
              }}
            />
          </svg>

          {/* Center text */}
          {!compact && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold tabular-nums">
                {Math.round(clampedProgress)}%
              </span>
            </div>
          )}
        </div>

        {compact && (
          <span className="text-xs font-semibold tabular-nums">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
    </div>
  );
}
