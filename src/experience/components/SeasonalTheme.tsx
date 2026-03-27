// @ts-nocheck
/**
 * Experience Layer — SeasonalTheme
 * Applies seasonal visual overrides to the ambient system
 * when user enters competitive season pages.
 *
 * Pure CSS particles + palette shift — no 3D.
 */

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../store/experience.store';
import type { SeasonTheme, MoodType } from '../types';
import { cn } from '@/lib/utils';

/* ── Predefined Seasons ──────────────────────────────────────── */

export const SEASONS: Record<string, SeasonTheme> = {
  'winter-crystal': {
    id: 'winter-crystal',
    name: 'Hiver Cristallin',
    palette: {
      primary: '#93c5fd',
      secondary: '#bfdbfe',
      glow: '#dbeafe',
      fog: '#0c1929',
      background: '#0f1d2e',
      particle: '#e0f2fe',
    },
    particleType: 'snow',
    lightTemperature: 'cold',
  },
  'spring-bloom': {
    id: 'spring-bloom',
    name: 'Printemps Fleuri',
    palette: {
      primary: '#f9a8d4',
      secondary: '#fbcfe8',
      glow: '#fce7f3',
      fog: '#1a0f16',
      background: '#1e1118',
      particle: '#fdf2f8',
    },
    particleType: 'petals',
    lightTemperature: 'warm',
  },
  'summer-fire': {
    id: 'summer-fire',
    name: 'Été Ardent',
    palette: {
      primary: '#fbbf24',
      secondary: '#fde68a',
      glow: '#fef3c7',
      fog: '#1a1408',
      background: '#1c1609',
      particle: '#fffbeb',
    },
    particleType: 'fireflies',
    lightTemperature: 'warm',
  },
  'autumn-harvest': {
    id: 'autumn-harvest',
    name: 'Automne Doré',
    palette: {
      primary: '#f97316',
      secondary: '#fdba74',
      glow: '#fed7aa',
      fog: '#1a0e08',
      background: '#1c100a',
      particle: '#fff7ed',
    },
    particleType: 'leaves',
    lightTemperature: 'warm',
  },
};

/* ── Seasonal Overlay Component ──────────────────────────────── */

interface SeasonalThemeOverlayProps {
  seasonId: string;
  className?: string;
}

export function SeasonalThemeOverlay({ seasonId, className }: SeasonalThemeOverlayProps) {
  const season = SEASONS[seasonId];
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);

  if (!season || reducedMotion) return null;

  return (
    <div className={cn('fixed inset-0 pointer-events-none -z-5 overflow-hidden', className)}>
      <SeasonParticles type={season.particleType} color={season.palette.particle} />
    </div>
  );
}

/* ── Season Particles (CSS-only) ─────────────────────────────── */

interface SeasonParticlesProps {
  type: SeasonTheme['particleType'];
  color: string;
  count?: number;
}

function SeasonParticles({ type, color, count = 20 }: SeasonParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 12,
        size: getParticleSize(type),
        drift: (Math.random() - 0.5) * 30,
        rotation: Math.random() * 360,
      })),
    [count, type]
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            background: type === 'fireflies'
              ? `radial-gradient(circle, ${color}, transparent 70%)`
              : color,
            borderRadius: type === 'leaves' ? '2px 8px 2px 8px' : '50%',
            opacity: type === 'fireflies' ? 0.8 : 0.4,
          }}
          animate={{
            y: ['0vh', '105vh'],
            x: [0, p.drift],
            rotate: [p.rotation, p.rotation + (type === 'leaves' ? 360 : 0)],
            opacity: type === 'fireflies' ? [0, 0.8, 0] : undefined,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}

function getParticleSize(type: SeasonTheme['particleType']): number {
  switch (type) {
    case 'snow': return 3 + Math.random() * 4;
    case 'petals': return 5 + Math.random() * 5;
    case 'leaves': return 6 + Math.random() * 6;
    case 'fireflies': return 3 + Math.random() * 3;
    case 'stars': return 2 + Math.random() * 2;
  }
}

/* ── Hook: Apply Season to AmbientProvider ───────────────────── */

export function useSeasonalTheme(seasonId: string | null) {
  const setMood = useExperienceStore((s) => s.setMood);

  useEffect(() => {
    if (!seasonId) return;
    const season = SEASONS[seasonId];
    if (!season) return;

    // Map season light temperature to a mood for ambient
    const moodMap: Record<string, MoodType> = {
      cold: 'calm',
      warm: 'energetic',
      neutral: 'neutral',
    };
    setMood(moodMap[season.lightTemperature] ?? 'neutral');
  }, [seasonId, setMood]);
}
