/**
 * Unified Visual Direction System for all 3D scenes
 * Ensures consistent color pipeline, fog, tone mapping, bloom, motion,
 * and particle behavior across Hero, Breathing, Galaxy, and Nebula.
 */

import * as THREE from 'three';

/* ── Color Palette ──────────────────────────────────────────── */

export const PALETTE = {
  // Core brand colors
  primary: '#7c3aed',       // Violet
  secondary: '#3b82f6',     // Blue
  accent: '#a78bfa',        // Light violet
  warm: '#ec4899',          // Pink
  gold: '#fbbf24',          // Gold

  // Scene-specific
  breathing: {
    inhale: '#4f9eff',
    hold: '#a78bfa',
    exhale: '#34d399',
    rest: '#fbbf24',
  },

  // Fog & atmosphere
  deepSpace: '#050510',
  darkVoid: '#0a0a1a',
  nebulaDark: '#0a0818',
  auroraBase: '#0a1810',
  oceanDeep: '#050d18',
} as const;

/* ── Fog Strategy ───────────────────────────────────────────── */

export interface FogConfig {
  color: string;
  near: number;
  far: number;
}

export const FOG: Record<string, FogConfig> = {
  hero:     { color: PALETTE.darkVoid,   near: 5,  far: 22 },
  breathing:{ color: PALETTE.darkVoid,   near: 4,  far: 20 },
  galaxy:   { color: PALETTE.deepSpace,  near: 6,  far: 30 },
  nebula:   { color: PALETTE.nebulaDark, near: 4,  far: 22 },
};

/* ── Tone Mapping ───────────────────────────────────────────── */

export const TONE_MAPPING = {
  mapping: THREE.ACESFilmicToneMapping,
  exposure: 1.15,
} as const;

/* ── Post-Processing Presets ────────────────────────────────── */

export interface PostProcessingPreset {
  bloomIntensity: number;
  bloomThreshold: number;
  bloomRadius: number;
  vignetteOffset: number;
  vignetteDarkness: number;
  chromaticAberration: boolean;
  chromaticOffset: number;
}

export const POST_PROCESSING: Record<string, PostProcessingPreset> = {
  hero: {
    bloomIntensity: 1.4,
    bloomThreshold: 0.2,
    bloomRadius: 0.75,
    vignetteOffset: 0.25,
    vignetteDarkness: 0.6,
    chromaticAberration: true,
    chromaticOffset: 0.0004,
  },
  breathing: {
    bloomIntensity: 1.6,
    bloomThreshold: 0.18,
    bloomRadius: 0.8,
    vignetteOffset: 0.3,
    vignetteDarkness: 0.65,
    chromaticAberration: true,
    chromaticOffset: 0.0005,
  },
  galaxy: {
    bloomIntensity: 2.0,
    bloomThreshold: 0.12,
    bloomRadius: 0.9,
    vignetteOffset: 0.3,
    vignetteDarkness: 0.8,
    chromaticAberration: true,
    chromaticOffset: 0.0005,
  },
  nebula: {
    bloomIntensity: 1.8,
    bloomThreshold: 0.15,
    bloomRadius: 0.85,
    vignetteOffset: 0.28,
    vignetteDarkness: 0.75,
    chromaticAberration: true,
    chromaticOffset: 0.0005,
  },
};

/* ── Camera Defaults ────────────────────────────────────────── */

export const CAMERA = {
  hero:     { position: [0, 0, 6] as [number, number, number], fov: 50 },
  breathing:{ position: [0, 0, 5] as [number, number, number], fov: 50 },
  galaxy:   { position: [10, 4, 10] as [number, number, number], fov: 55 },
  nebula:   { position: [0, 0, 5] as [number, number, number], fov: 50 },
};

/* ── Motion & Easing ────────────────────────────────────────── */

export const MOTION = {
  // Camera sway amplitude and speed
  cameraSway: { amplitude: 0.25, speed: 0.08 },
  // Particle rotation speeds
  particleRotation: { slow: 0.01, normal: 0.02, fast: 0.04 },
  // Breathing easing (sine-based for organic feel)
  breathEase: (t: number) => Math.sin(t * Math.PI * 0.5),
  // Cinematic ease-in-out
  cinematicEase: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
} as const;

/* ── Particle Budgets ───────────────────────────────────────── */

export const PARTICLE_BUDGETS = {
  hero:      { desktop: 200, mobile: 80 },
  breathing: { desktop: 300, mobile: 120 },
  galaxy:    { desktop: 5000, mobile: 2000 },
  nebula:    { desktop: 400, mobile: 150 },
  interactive: { desktop: 180, mobile: 60 },
} as const;

/* ── Device Detection & Performance ─────────────────────────── */

export const getDeviceTier = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'medium';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'low';

  // Check device pixel ratio and screen size
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;

  // Mobile or low-DPR → low tier
  if (width < 768 || dpr < 1.5) return 'low';
  // Tablet or moderate → medium
  if (width < 1200) return 'medium';
  // Desktop with good display → high
  return 'high';
};

export const getDPR = (): [number, number] => {
  const tier = getDeviceTier();
  switch (tier) {
    case 'high': return [1, 2];
    case 'medium': return [1, 1.5];
    case 'low': return [1, 1];
  }
};

export const getParticleCount = (scene: keyof typeof PARTICLE_BUDGETS): number => {
  const tier = getDeviceTier();
  const budget = PARTICLE_BUDGETS[scene];
  switch (tier) {
    case 'high': return budget.desktop;
    case 'medium': return Math.round(budget.desktop * 0.6);
    case 'low': return budget.mobile;
  }
};

/* ── Shared GL Config ───────────────────────────────────────── */

export const getGLConfig = () => ({
  antialias: true,
  alpha: true,
  toneMapping: TONE_MAPPING.mapping,
  toneMappingExposure: TONE_MAPPING.exposure,
  powerPreference: 'high-performance' as const,
});

/* ── Reduced Motion Check ───────────────────────────────────── */

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
