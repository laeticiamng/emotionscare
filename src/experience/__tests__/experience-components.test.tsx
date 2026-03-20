/**
 * Experience Layer — Component Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return React.forwardRef(({ children, ...props }: any, ref: any) => {
        const Tag = typeof prop === 'string' ? prop : 'div';
        return React.createElement(Tag, { ...props, ref }, children);
      });
    },
  }),
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useMotionValue: (v: number) => ({ get: () => v, set: vi.fn() }),
  useTransform: (v: any, i: any, o: any) => ({ get: () => o?.[0] ?? 0 }),
}));

// Mock zustand store
vi.mock('../store/experience.store', () => {
  const state = {
    ambient: {
      mood: 'neutral' as const,
      timeOfDay: 'afternoon' as const,
      palette: {
        primary: '#64748b',
        secondary: '#94a3b8',
        glow: '#cbd5e1',
        fog: '#0f1218',
        background: '#111827',
        particle: '#e2e8f0',
      },
      lightIntensity: 0.5,
      fogDensity: 0.3,
      motionIntensity: 0.5,
      breathPhase: null,
    },
    deviceTier: 'medium' as const,
    currentImmersionLevel: 1 as const,
    currentTransition: { type: 'cut' as const, duration: 0 },
    activeFeedback: null,
    preferences: {
      reducedMotion: false,
      ambientAudioEnabled: false,
      maxImmersionLevel: 3 as const,
      masterVolume: 0.5,
    },
  };

  return {
    useExperienceStore: (selector?: (s: typeof state) => any) =>
      selector ? selector(state) : state,
  };
});

describe('Experience Components', () => {
  describe('DepthCard', () => {
    it('exports correctly', async () => {
      const { DepthCard } = await import('../components/DepthCard');
      expect(DepthCard).toBeDefined();
      expect(typeof DepthCard).toMatch(/function|object/); // forwardRef or function component
    });
  });

  describe('RevealContainer', () => {
    it('exports correctly', async () => {
      const { RevealContainer } = await import('../components/RevealContainer');
      expect(RevealContainer).toBeDefined();
    });
  });

  describe('EnvironmentalStreak', () => {
    it('exports correctly', async () => {
      const { EnvironmentalStreak } = await import('../components/EnvironmentalStreak');
      expect(EnvironmentalStreak).toBeDefined();
    });
  });

  describe('ProgressionAura', () => {
    it('exports correctly', async () => {
      const { ProgressionAura } = await import('../components/ProgressionAura');
      expect(ProgressionAura).toBeDefined();
    });
  });

  describe('MicroFeedback', () => {
    it('exports overlay and hook', async () => {
      const mod = await import('../components/MicroFeedback');
      expect(mod.MicroFeedbackOverlay).toBeDefined();
      expect(mod.useMicroFeedback).toBeDefined();
    });
  });

  describe('EmotionResonance', () => {
    it('exports correctly', async () => {
      const { EmotionResonance } = await import('../components/EmotionResonance');
      expect(EmotionResonance).toBeDefined();
    });
  });

  describe('SeasonalTheme', () => {
    it('exports overlay, hook, and seasons', async () => {
      const mod = await import('../components/SeasonalTheme');
      expect(mod.SeasonalThemeOverlay).toBeDefined();
      expect(mod.useSeasonalTheme).toBeDefined();
      expect(mod.SEASONS).toBeDefined();
    });
  });

  describe('AchievementHall', () => {
    it('exports correctly', async () => {
      const { AchievementHall } = await import('../components/AchievementHall');
      expect(AchievementHall).toBeDefined();
    });
  });

  describe('ImmersiveOnboarding', () => {
    it('exports correctly', async () => {
      const { ImmersiveOnboarding } = await import('../components/ImmersiveOnboarding');
      expect(ImmersiveOnboarding).toBeDefined();
    });
  });

  describe('PageTransition', () => {
    it('exports correctly', async () => {
      const { PageTransition } = await import('../components/PageTransition');
      expect(PageTransition).toBeDefined();
    });
  });

  describe('AmbientBackground', () => {
    it('exports correctly', async () => {
      const { AmbientBackground } = await import('../components/AmbientBackground');
      expect(AmbientBackground).toBeDefined();
    });
  });
});

describe('Experience Hooks', () => {
  describe('useAmbient', () => {
    it('returns ambient state and derived values', async () => {
      const { useAmbient } = await import('../hooks/useAmbient');
      // Since the store is mocked, calling the hook returns computed values
      const result = useAmbient();
      expect(result.mood).toBe('neutral');
      expect(result.immersionLevel).toBe(1);
      expect(result.isImmersive).toBe(false); // level 1 < 2
      expect(result.isSignatureScene).toBe(false);
      expect(result.shouldAnimate).toBe(true); // not reduced, motion > 0
      expect(result.palette).toBeDefined();
      expect(result.deviceTier).toBe('medium');
    });
  });

  describe('useImmersionLevel', () => {
    it('returns the current immersion level', async () => {
      const { useImmersionLevel } = await import('../hooks/useAmbient');
      const level = useImmersionLevel();
      expect(level).toBe(1);
    });
  });

  describe('useDeviceTier', () => {
    it('returns the device tier', async () => {
      const { useDeviceTier } = await import('../hooks/useAmbient');
      const tier = useDeviceTier();
      expect(tier).toBe('medium');
    });
  });

  describe('useAmbientActions', () => {
    it('returns an object with action keys', async () => {
      const { useAmbientActions } = await import('../hooks/useAmbient');
      const actions = useAmbientActions();
      expect(actions).toBeDefined();
      expect('setMood' in actions).toBe(true);
      expect('setBreathPhase' in actions).toBe(true);
      expect('triggerFeedback' in actions).toBe(true);
      expect('updatePreferences' in actions).toBe(true);
    });
  });
});

describe('Experience Config', () => {
  describe('palettes', () => {
    it('returns valid palette for each mood', async () => {
      const { getAmbientPalette } = await import('../config/palettes');
      const moods = ['calm', 'happy', 'sad', 'anxious', 'neutral', 'energetic', 'focused'] as const;

      for (const mood of moods) {
        const palette = getAmbientPalette(mood, 'afternoon');
        expect(palette.primary).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.secondary).toBeTruthy();
        expect(palette.glow).toBeTruthy();
      }
    });

    it('returns light/fog/motion values in 0-1 range', async () => {
      const { getLightIntensity, getFogDensity, getMotionIntensity } = await import('../config/palettes');

      const light = getLightIntensity('neutral', 'afternoon');
      const fog = getFogDensity('neutral', 'afternoon');
      const motion = getMotionIntensity('neutral');

      expect(light).toBeGreaterThanOrEqual(0);
      expect(light).toBeLessThanOrEqual(1);
      expect(fog).toBeGreaterThanOrEqual(0);
      expect(fog).toBeLessThanOrEqual(1);
      expect(motion).toBeGreaterThanOrEqual(0);
      expect(motion).toBeLessThanOrEqual(1);
    });
  });

  describe('immersionRegistry', () => {
    it('returns config for known routes', async () => {
      const { getRouteExperienceConfig } = await import('../config/immersionRegistry');
      const config = getRouteExperienceConfig('/app/dashboard');
      expect(config).toBeDefined();
      expect(typeof config.immersionLevel).toBe('number');
      expect(config.transition).toBeDefined();
    });
  });
});

describe('Experience Barrel Exports', () => {
  it('exports all expected modules from index', async () => {
    const mod = await import('../index');

    // Provider
    expect(mod.AmbientProvider).toBeDefined();

    // Store
    expect(mod.useExperienceStore).toBeDefined();

    // Config
    expect(mod.getRouteExperienceConfig).toBeDefined();
    expect(mod.getAmbientPalette).toBeDefined();

    // Hooks
    expect(mod.useAmbient).toBeDefined();
    expect(mod.useAmbientActions).toBeDefined();
    expect(mod.useImmersionLevel).toBeDefined();
    expect(mod.useDeviceTier).toBeDefined();
    expect(mod.useDepthInteraction).toBeDefined();
    expect(mod.useAmbientAudio).toBeDefined();
    expect(mod.useRouteExperience).toBeDefined();

    // Components
    expect(mod.DepthCard).toBeDefined();
    expect(mod.AmbientBackground).toBeDefined();
    expect(mod.PageTransition).toBeDefined();
    expect(mod.RevealContainer).toBeDefined();
    expect(mod.MicroFeedbackOverlay).toBeDefined();
    expect(mod.EmotionResonance).toBeDefined();
    expect(mod.EnvironmentalStreak).toBeDefined();
    expect(mod.SeasonalThemeOverlay).toBeDefined();
    expect(mod.AchievementHall).toBeDefined();
    expect(mod.ImmersiveOnboarding).toBeDefined();
    expect(mod.ProgressionAura).toBeDefined();

    // Services
    expect(mod.audioEngine).toBeDefined();
  });
});
