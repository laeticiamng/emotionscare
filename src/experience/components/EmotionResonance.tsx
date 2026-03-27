// @ts-nocheck
/**
 * Experience Layer — EmotionResonance
 * Visual feedback component that resonates with detected emotion after a scan.
 * Renders as an ambient overlay that colors the environment.
 *
 * Not full-screen. Integrates into the scan result area.
 * Pulses gently for 5s, then attenuates.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../store/experience.store';
import type { MoodType } from '../types';
import { cn } from '@/lib/utils';

interface EmotionResonanceProps {
  emotion: MoodType;
  /** Intensity from scan result (0-1) */
  intensity?: number;
  /** Auto-dismiss after this many ms (default 5000) */
  duration?: number;
  className?: string;
}

const EMOTION_COLORS: Record<MoodType, { primary: string; secondary: string; glow: string }> = {
  calm: { primary: '#6366f1', secondary: '#818cf8', glow: '#a5b4fc' },
  happy: { primary: '#f59e0b', secondary: '#fbbf24', glow: '#fde68a' },
  sad: { primary: '#3b82f6', secondary: '#60a5fa', glow: '#93c5fd' },
  anxious: { primary: '#8b5cf6', secondary: '#a78bfa', glow: '#c4b5fd' },
  neutral: { primary: '#64748b', secondary: '#94a3b8', glow: '#cbd5e1' },
  energetic: { primary: '#ef4444', secondary: '#f97316', glow: '#fdba74' },
  focused: { primary: '#06b6d4', secondary: '#22d3ee', glow: '#67e8f9' },
};

export function EmotionResonance({
  emotion,
  intensity = 0.7,
  duration = 5000,
  className,
}: EmotionResonanceProps) {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);
  const setMood = useExperienceStore((s) => s.setMood);
  const colors = EMOTION_COLORS[emotion] ?? EMOTION_COLORS.neutral;

  // Update global mood
  useEffect(() => {
    setMood(emotion);
  }, [emotion, setMood]);

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (reducedMotion) {
    return (
      <div
        className={cn('rounded-2xl p-4 border', className)}
        style={{ borderColor: `${colors.primary}40`, backgroundColor: `${colors.primary}08` }}
      />
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn('relative rounded-2xl overflow-hidden', className)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Resonance glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse 80% 80% at 50% 50%,
                  ${colors.glow}${Math.round(intensity * 0.15 * 255).toString(16).padStart(2, '0')},
                  transparent 70%
                )
              `,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              boxShadow: `inset 0 0 30px ${colors.primary}${Math.round(intensity * 0.1 * 255).toString(16).padStart(2, '0')}`,
            }}
            animate={{
              boxShadow: [
                `inset 0 0 20px ${colors.primary}10`,
                `inset 0 0 40px ${colors.primary}18`,
                `inset 0 0 20px ${colors.primary}10`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
