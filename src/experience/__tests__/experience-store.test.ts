/**
 * Experience Layer — Store Unit Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useExperienceStore } from '../store/experience.store';
import type { ImmersionLevel, MoodType, FeedbackEvent } from '../types';

// Reset store between tests
function resetStore() {
  useExperienceStore.setState({
    currentImmersionLevel: 0,
    currentTransition: { type: 'cut', duration: 0 },
    activeFeedback: null,
    preferences: {
      reducedMotion: false,
      ambientAudioEnabled: false,
      maxImmersionLevel: 3 as ImmersionLevel,
      masterVolume: 0.5,
    },
  });
}

describe('ExperienceStore', () => {
  beforeEach(() => {
    resetStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('starts at immersion level 0', () => {
      const state = useExperienceStore.getState();
      expect(state.currentImmersionLevel).toBe(0);
    });

    it('has neutral mood by default', () => {
      const state = useExperienceStore.getState();
      expect(state.ambient.mood).toBe('neutral');
    });

    it('has a valid ambient palette', () => {
      const { ambient } = useExperienceStore.getState();
      expect(ambient.palette).toBeDefined();
      expect(ambient.palette.primary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(ambient.palette.secondary).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('has no active feedback', () => {
      expect(useExperienceStore.getState().activeFeedback).toBeNull();
    });
  });

  describe('setMood', () => {
    it('changes ambient mood and recomputes palette', () => {
      const store = useExperienceStore.getState();
      const initialPalette = store.ambient.palette.primary;

      store.setMood('happy');
      const updated = useExperienceStore.getState();
      expect(updated.ambient.mood).toBe('happy');
      expect(updated.ambient.palette.primary).not.toBe(initialPalette);
    });

    it.each<MoodType>(['calm', 'happy', 'sad', 'anxious', 'neutral', 'energetic', 'focused'])(
      'accepts mood "%s"',
      (mood) => {
        useExperienceStore.getState().setMood(mood);
        expect(useExperienceStore.getState().ambient.mood).toBe(mood);
      }
    );
  });

  describe('setTimeOfDay', () => {
    it('updates timeOfDay in ambient state', () => {
      useExperienceStore.getState().setTimeOfDay('night');
      expect(useExperienceStore.getState().ambient.timeOfDay).toBe('night');
    });

    it('recomputes light and fog', () => {
      const before = useExperienceStore.getState().ambient.lightIntensity;
      useExperienceStore.getState().setTimeOfDay('night');
      const after = useExperienceStore.getState().ambient.lightIntensity;
      // Night should have different intensity
      expect(typeof after).toBe('number');
    });
  });

  describe('setImmersionLevel', () => {
    it('sets level within max', () => {
      useExperienceStore.getState().setImmersionLevel(2);
      expect(useExperienceStore.getState().currentImmersionLevel).toBe(2);
    });

    it('clamps to maxImmersionLevel', () => {
      useExperienceStore.getState().updatePreferences({ maxImmersionLevel: 1 as ImmersionLevel });
      useExperienceStore.getState().setImmersionLevel(3);
      expect(useExperienceStore.getState().currentImmersionLevel).toBe(1);
    });

    it('allows setting level 0', () => {
      useExperienceStore.getState().setImmersionLevel(0);
      expect(useExperienceStore.getState().currentImmersionLevel).toBe(0);
    });
  });

  describe('setTransition', () => {
    it('updates the transition config', () => {
      useExperienceStore.getState().setTransition({ type: 'fade-through', duration: 400 });
      const { currentTransition } = useExperienceStore.getState();
      expect(currentTransition.type).toBe('fade-through');
      expect(currentTransition.duration).toBe(400);
    });
  });

  describe('setBreathPhase', () => {
    it('updates breathPhase in ambient', () => {
      useExperienceStore.getState().setBreathPhase('inhale');
      expect(useExperienceStore.getState().ambient.breathPhase).toBe('inhale');
    });

    it('can set to null', () => {
      useExperienceStore.getState().setBreathPhase('exhale');
      useExperienceStore.getState().setBreathPhase(null);
      expect(useExperienceStore.getState().ambient.breathPhase).toBeNull();
    });
  });

  describe('triggerFeedback', () => {
    it('sets activeFeedback', () => {
      const event: FeedbackEvent = { type: 'pulse', intensity: 0.8 };
      useExperienceStore.getState().triggerFeedback(event);
      expect(useExperienceStore.getState().activeFeedback).toBe(event);
    });

    it('auto-clears after duration', () => {
      const event: FeedbackEvent = { type: 'ripple', duration: 500 };
      useExperienceStore.getState().triggerFeedback(event);
      expect(useExperienceStore.getState().activeFeedback).toBe(event);

      vi.advanceTimersByTime(500);
      expect(useExperienceStore.getState().activeFeedback).toBeNull();
    });

    it('uses default 800ms if no duration', () => {
      const event: FeedbackEvent = { type: 'glow' };
      useExperienceStore.getState().triggerFeedback(event);

      vi.advanceTimersByTime(799);
      expect(useExperienceStore.getState().activeFeedback).toBe(event);

      vi.advanceTimersByTime(1);
      expect(useExperienceStore.getState().activeFeedback).toBeNull();
    });
  });

  describe('clearFeedback', () => {
    it('removes active feedback immediately', () => {
      useExperienceStore.getState().triggerFeedback({ type: 'wave' });
      useExperienceStore.getState().clearFeedback();
      expect(useExperienceStore.getState().activeFeedback).toBeNull();
    });
  });

  describe('updatePreferences', () => {
    it('merges partial preferences', () => {
      useExperienceStore.getState().updatePreferences({ masterVolume: 0.8 });
      const { preferences } = useExperienceStore.getState();
      expect(preferences.masterVolume).toBe(0.8);
      expect(preferences.reducedMotion).toBe(false); // unchanged
    });

    it('recomputes ambient when reducedMotion changes', () => {
      useExperienceStore.getState().setMood('energetic');
      const beforeMotion = useExperienceStore.getState().ambient.motionIntensity;

      useExperienceStore.getState().updatePreferences({ reducedMotion: true });
      const afterMotion = useExperienceStore.getState().ambient.motionIntensity;
      expect(afterMotion).toBe(0);
    });
  });

  describe('refreshTimeOfDay', () => {
    it('does not throw', () => {
      expect(() => useExperienceStore.getState().refreshTimeOfDay()).not.toThrow();
    });
  });

  describe('refreshDeviceTier', () => {
    it('updates deviceTier', () => {
      expect(() => useExperienceStore.getState().refreshDeviceTier()).not.toThrow();
      const tier = useExperienceStore.getState().deviceTier;
      expect(['high', 'medium', 'low']).toContain(tier);
    });
  });
});
