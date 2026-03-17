/**
 * Unified Visual Direction System for all 3D scenes
 * Ensures consistent color pipeline, fog, tone mapping, bloom, motion,
 * and particle behavior across Hero, Breathing, Galaxy, and Nebula.
 *
 * Scene intentions (T5):
 *   Hero     — Promise / Inspiration / Aspiration
 *   Breathing — Calm / Centering / Rhythm
 *   Galaxy   — Exploration / Discovery / Majesty
 *   Nebula   — Introspection / Envelopment / Presence
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

/* ── Scene Intentions ──────────────────────────────────────── */

export const SCENE_INTENTIONS = {
  hero: {
    mood: 'aspiration',
    description: 'Promise / Inspiration / Aspiration',
    cameraMovement: 'gentle-sway',     // Minimal, inviting
    particleDensity: 'sparse',          // Clean, premium
    glowIntensity: 'subtle',            // Not overwhelming
    lightingMood: 'warm-cool-balance',
  },
  breathing: {
    mood: 'calm',
    description: 'Calm / Centering / Rhythm',
    cameraMovement: 'breath-sync',      // Follows breathing cycle
    particleDensity: 'moderate',         // Supportive
    glowIntensity: 'phase-driven',       // Pulses with phase
    lightingMood: 'phase-color-shift',
  },
  galaxy: {
    mood: 'majesty',
    description: 'Exploration / Discovery / Majesty',
    cameraMovement: 'orbital-flythrough', // Slow, majestic orbit
    particleDensity: 'dense',             // Starfield richness
    glowIntensity: 'moderate',            // Core glow without wash
    lightingMood: 'cool-with-warm-core',
  },
  nebula: {
    mood: 'introspection',
    description: 'Introspection / Envelopment / Presence',
    cameraMovement: 'gentle-drift',      // Slow, cocooning
    particleDensity: 'moderate',          // Enveloping but not busy
    glowIntensity: 'warm-enveloping',    // Soft, immersive
    lightingMood: 'palette-driven',
  },
} as const;

/* ── Fog Strategy ───────────────────────────────────────────── */

export interface FogConfig {
  color: string;
  near: number;
  far: number;
}

export const FOG: Record<string, FogConfig> = {
  hero:     { color: PALETTE.darkVoid,   near: 8,  far: 28 },
  breathing:{ color: PALETTE.darkVoid,   near: 7,  far: 26 },
  galaxy:   { color: PALETTE.deepSpace,  near: 10, far: 40 },
  nebula:   { color: PALETTE.nebulaDark, near: 7,  far: 28 },
};

/**
 * Device-adaptive fog: on low-tier devices, push fog far plane further
 * to avoid washing out content that's already dimmer due to reduced effects.
 */
export const getAdaptiveFog = (scene: keyof typeof FOG): FogConfig => {
  const base = FOG[scene];
  if (!base) return FOG.hero;
  const tier = getDeviceTier();
  if (tier === 'low') {
    // Low-tier: push fog back to preserve clarity with simpler rendering
    return { ...base, near: base.near + 2, far: base.far + 6 };
  }
  if (tier === 'medium') {
    return { ...base, near: base.near + 1, far: base.far + 3 };
  }
  return base;
};

/* ── Tone Mapping ───────────────────────────────────────────── */

export const TONE_MAPPING = {
  mapping: THREE.ACESFilmicToneMapping,
  exposure: 1.5,
} as const;

/* ── Post-Processing Presets ────────────────────────────────── */
/* Recalibrated: bloom enhances without washing out. Vignette adds depth. */

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
    bloomIntensity: 0.8,
    bloomThreshold: 0.4,
    bloomRadius: 0.55,
    vignetteOffset: 0.3,
    vignetteDarkness: 0.45,
    chromaticAberration: true,
    chromaticOffset: 0.0002,
  },
  breathing: {
    bloomIntensity: 0.9,
    bloomThreshold: 0.35,
    bloomRadius: 0.6,
    vignetteOffset: 0.3,
    vignetteDarkness: 0.45,
    chromaticAberration: true,
    chromaticOffset: 0.0003,
  },
  galaxy: {
    bloomIntensity: 1.1,
    bloomThreshold: 0.3,
    bloomRadius: 0.65,
    vignetteOffset: 0.25,
    vignetteDarkness: 0.5,
    chromaticAberration: true,
    chromaticOffset: 0.0003,
  },
  nebula: {
    bloomIntensity: 1.0,
    bloomThreshold: 0.32,
    bloomRadius: 0.6,
    vignetteOffset: 0.25,
    vignetteDarkness: 0.5,
    chromaticAberration: true,
    chromaticOffset: 0.0003,
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
  cameraSway: { amplitude: 0.2, speed: 0.06 },
  // Particle rotation speeds
  particleRotation: { slow: 0.008, normal: 0.015, fast: 0.03 },
  // Breathing easing (sine-based for organic feel)
  breathEase: (t: number) => Math.sin(t * Math.PI * 0.5),
  // Cinematic ease-in-out
  cinematicEase: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
} as const;

/* ── Particle Budgets ───────────────────────────────────────── */

export const PARTICLE_BUDGETS = {
  hero:      { desktop: 160, mobile: 60 },
  breathing: { desktop: 250, mobile: 100 },
  galaxy:    { desktop: 4000, mobile: 1500 },
  nebula:    { desktop: 350, mobile: 120 },
  interactive: { desktop: 140, mobile: 40 },
} as const;

/* ── Stars Budget (scaled by device tier) ─────────────────── */

export const STARS_BUDGETS = {
  hero:      { high: 1000, medium: 600, low: 300 },
  breathing: { high: 1500, medium: 900, low: 400 },
  galaxy:    { high: 2200, medium: 1400, low: 600 },
  nebula:    { high: 1600, medium: 1000, low: 400 },
} as const;

export const getStarsCount = (scene: keyof typeof STARS_BUDGETS): number => {
  const tier = getDeviceTier();
  return STARS_BUDGETS[scene][tier];
};

/* ── Device Detection & Performance ─────────────────────────── */

export const getDeviceTier = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'medium';

  // Check reduced motion preference
  if (prefersReducedMotion()) return 'low';

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;

  // Mobile or low-DPR -> low tier
  if (width < 768 || dpr < 1.5) return 'low';
  // Check hardware concurrency if available
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return 'low';
  // Tablet or moderate -> medium
  if (width < 1200) return 'medium';
  // Desktop with good display -> high
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

/** Whether postprocessing should be enabled for this device */
export const shouldEnablePostProcessing = (): boolean => {
  const tier = getDeviceTier();
  return tier !== 'low';
};

/* ── Shared GL Config ───────────────────────────────────────── */

export const getGLConfig = () => ({
  antialias: getDeviceTier() !== 'low',
  alpha: true,
  toneMapping: TONE_MAPPING.mapping,
  toneMappingExposure: TONE_MAPPING.exposure,
  powerPreference: getDeviceTier() === 'low' ? 'low-power' as const : 'high-performance' as const,
  failIfMajorPerformanceCaveat: false,
});

/* ── Reduced Motion Check ───────────────────────────────────── */

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/* ── Tab Visibility ─────────────────────────────────────────── */

export const isTabVisible = (): boolean => {
  if (typeof document === 'undefined') return true;
  return document.visibilityState === 'visible';
};
