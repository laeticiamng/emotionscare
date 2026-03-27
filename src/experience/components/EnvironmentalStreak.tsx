// @ts-nocheck
/**
 * Experience Layer — EnvironmentalStreak
 * Persistent header indicator that visualizes the user's streak.
 * Intensity scales with streak length.
 *
 * Streak 0:     invisible
 * Streak 1-6:   small static flame icon
 * Streak 7-13:  flame with CSS particles
 * Streak 14-29: larger flame, more particles
 * Streak 30+:   golden flame with halo
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExperienceStore } from '../store/experience.store';

interface EnvironmentalStreakProps {
  streakDays: number;
  onClick?: () => void;
  className?: string;
}

function getStreakTier(days: number) {
  if (days <= 0) return 'none';
  if (days <= 6) return 'spark';
  if (days <= 13) return 'flame';
  if (days <= 29) return 'blaze';
  return 'inferno';
}

const TIER_CONFIG = {
  none: { size: 0, color: 'text-muted-foreground', particles: 0, glow: false },
  spark: { size: 16, color: 'text-orange-400', particles: 0, glow: false },
  flame: { size: 18, color: 'text-orange-500', particles: 3, glow: false },
  blaze: { size: 20, color: 'text-orange-500', particles: 5, glow: true },
  inferno: { size: 22, color: 'text-amber-400', particles: 7, glow: true },
};

export function EnvironmentalStreak({ streakDays, onClick, className }: EnvironmentalStreakProps) {
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);
  const tier = getStreakTier(streakDays);
  const config = TIER_CONFIG[tier];

  const particles = useMemo(() => {
    if (config.particles === 0 || reducedMotion) return [];
    return Array.from({ length: config.particles }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 20,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random(),
      size: 2 + Math.random() * 2,
    }));
  }, [config.particles, reducedMotion]);

  if (tier === 'none') return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center gap-1 px-2 py-1 rounded-full transition-colors',
        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      title={`Streak: ${streakDays} jours`}
    >
      {/* Glow halo for blaze+ */}
      <AnimatePresence>
        {config.glow && !reducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: tier === 'inferno'
                ? 'radial-gradient(circle, rgba(251,191,36,0.2), transparent 70%)'
                : 'radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Flame icon */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                scale: [1, 1.05, 1],
                y: [0, -1, 0],
              }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Flame
          size={config.size}
          className={cn(config.color, tier === 'inferno' && 'drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]')}
        />
      </motion.div>

      {/* CSS Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `calc(50% + ${p.x}px)`,
            bottom: '60%',
            background: tier === 'inferno'
              ? 'radial-gradient(circle, #fbbf24, #f59e0b)'
              : 'radial-gradient(circle, #f97316, #ea580c)',
          }}
          animate={{
            y: [-5, -20 - Math.random() * 10],
            opacity: [0.7, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Streak count */}
      <span className={cn('text-xs font-semibold tabular-nums', config.color)}>
        {streakDays}
      </span>
    </button>
  );
}
