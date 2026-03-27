// @ts-nocheck
/**
 * Experience Layer — Ambient Palettes
 * Mood × TimeOfDay → AmbientPalette
 */

import type { AmbientPalette, MoodType, TimeOfDay } from '../types';

/* ── Base Palettes per Mood ──────────────────────────────────── */

const MOOD_PALETTES: Record<MoodType, AmbientPalette> = {
  calm: {
    primary: '#6366f1',     // Indigo
    secondary: '#818cf8',
    glow: '#a5b4fc',
    fog: '#0c0a20',
    background: '#0f0d24',
    particle: '#c7d2fe',
  },
  happy: {
    primary: '#f59e0b',     // Amber
    secondary: '#fbbf24',
    glow: '#fde68a',
    fog: '#1a1408',
    background: '#1c1609',
    particle: '#fef3c7',
  },
  sad: {
    primary: '#3b82f6',     // Blue
    secondary: '#60a5fa',
    glow: '#93c5fd',
    fog: '#080d18',
    background: '#0a1020',
    particle: '#bfdbfe',
  },
  anxious: {
    primary: '#8b5cf6',     // Violet
    secondary: '#a78bfa',
    glow: '#c4b5fd',
    fog: '#100a20',
    background: '#130d28',
    particle: '#ddd6fe',
  },
  neutral: {
    primary: '#64748b',     // Slate
    secondary: '#94a3b8',
    glow: '#cbd5e1',
    fog: '#0f1218',
    background: '#111827',
    particle: '#e2e8f0',
  },
  energetic: {
    primary: '#ef4444',     // Red-orange
    secondary: '#f97316',
    glow: '#fdba74',
    fog: '#1a0a08',
    background: '#1c0c09',
    particle: '#fed7aa',
  },
  focused: {
    primary: '#06b6d4',     // Cyan
    secondary: '#22d3ee',
    glow: '#67e8f9',
    fog: '#081418',
    background: '#0a1820',
    particle: '#a5f3fc',
  },
};

/* ── Time-of-Day Modifiers ───────────────────────────────────── */

const TIME_MODIFIERS: Record<TimeOfDay, { lightMultiplier: number; warmthShift: number }> = {
  morning: { lightMultiplier: 0.85, warmthShift: 10 },
  afternoon: { lightMultiplier: 1.0, warmthShift: 0 },
  evening: { lightMultiplier: 0.7, warmthShift: -10 },
  night: { lightMultiplier: 0.5, warmthShift: -20 },
};

/* ── Palette Resolution ──────────────────────────────────────── */

export function getAmbientPalette(mood: MoodType, _timeOfDay?: TimeOfDay): AmbientPalette {
  return MOOD_PALETTES[mood] ?? MOOD_PALETTES.neutral;
}

export function getLightIntensity(mood: MoodType, timeOfDay: TimeOfDay): number {
  const baseIntensity: Record<MoodType, number> = {
    calm: 0.5,
    happy: 0.8,
    sad: 0.35,
    anxious: 0.4,
    neutral: 0.6,
    energetic: 0.85,
    focused: 0.65,
  };
  const modifier = TIME_MODIFIERS[timeOfDay];
  return Math.min(1, (baseIntensity[mood] ?? 0.6) * modifier.lightMultiplier);
}

export function getFogDensity(mood: MoodType, timeOfDay: TimeOfDay): number {
  const baseDensity: Record<MoodType, number> = {
    calm: 0.4,
    happy: 0.2,
    sad: 0.6,
    anxious: 0.55,
    neutral: 0.35,
    energetic: 0.15,
    focused: 0.3,
  };
  const nightBonus = timeOfDay === 'night' ? 0.15 : timeOfDay === 'evening' ? 0.08 : 0;
  return Math.min(1, (baseDensity[mood] ?? 0.35) + nightBonus);
}

export function getMotionIntensity(mood: MoodType): number {
  const base: Record<MoodType, number> = {
    calm: 0.3,
    happy: 0.7,
    sad: 0.2,
    anxious: 0.5,
    neutral: 0.4,
    energetic: 0.9,
    focused: 0.35,
  };
  return base[mood] ?? 0.4;
}
