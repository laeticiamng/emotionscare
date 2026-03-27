// @ts-nocheck
/**
 * Experience Layer — useAmbient hook
 * Provides convenient access to ambient state and actions.
 */

import { useExperienceStore } from '../store/experience.store';
import type { MoodType, BreathPhase, FeedbackEvent, ImmersionLevel } from '../types';

export function useAmbient() {
  const ambient = useExperienceStore((s) => s.ambient);
  const deviceTier = useExperienceStore((s) => s.deviceTier);
  const immersionLevel = useExperienceStore((s) => s.currentImmersionLevel);
  const preferences = useExperienceStore((s) => s.preferences);

  return {
    // State
    mood: ambient.mood,
    palette: ambient.palette,
    lightIntensity: ambient.lightIntensity,
    fogDensity: ambient.fogDensity,
    motionIntensity: ambient.motionIntensity,
    timeOfDay: ambient.timeOfDay,
    breathPhase: ambient.breathPhase,
    deviceTier,
    immersionLevel,
    preferences,

    // Derived
    isImmersive: immersionLevel >= 2,
    isSignatureScene: immersionLevel === 3,
    canUseCanvas: deviceTier !== 'low' && immersionLevel >= 2,
    shouldAnimate: !preferences.reducedMotion && ambient.motionIntensity > 0,
  };
}

export function useAmbientActions() {
  const setMood = useExperienceStore((s) => s.setMood);
  const setBreathPhase = useExperienceStore((s) => s.setBreathPhase);
  const triggerFeedback = useExperienceStore((s) => s.triggerFeedback);
  const updatePreferences = useExperienceStore((s) => s.updatePreferences);

  return { setMood, setBreathPhase, triggerFeedback, updatePreferences };
}

export function useImmersionLevel(): ImmersionLevel {
  return useExperienceStore((s) => s.currentImmersionLevel);
}

export function useDeviceTier() {
  return useExperienceStore((s) => s.deviceTier);
}
