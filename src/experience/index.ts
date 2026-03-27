// @ts-nocheck
/**
 * Experience Layer — Barrel Exports
 * Single entry point for all experience layer modules.
 */

// ── Types ──────────────────────────────────────────────────────
export type {
  ImmersionLevel,
  TimeOfDay,
  MoodType,
  AmbientPalette,
  AmbientState,
  DeviceTier,
  TransitionType,
  TransitionConfig,
  BreathPhase,
  PageExperienceConfig,
  ExperiencePreferences,
  FeedbackType,
  FeedbackEvent,
  SeasonTheme,
} from './types';

// ── Provider ───────────────────────────────────────────────────
export { AmbientProvider } from './providers/AmbientProvider';

// ── Store ──────────────────────────────────────────────────────
export { useExperienceStore } from './store/experience.store';

// ── Config ─────────────────────────────────────────────────────
export { getRouteExperienceConfig } from './config/immersionRegistry';
export {
  getAmbientPalette,
  getLightIntensity,
  getFogDensity,
  getMotionIntensity,
} from './config/palettes';

// ── Hooks ──────────────────────────────────────────────────────
export {
  useAmbient,
  useAmbientActions,
  useImmersionLevel,
  useDeviceTier,
} from './hooks/useAmbient';
export { useDepthInteraction } from './hooks/useDepthInteraction';
export { useAmbientAudio } from './hooks/useAmbientAudio';
export { useRouteExperience } from './hooks/useRouteExperience';

// ── Components ─────────────────────────────────────────────────
export { DepthCard } from './components/DepthCard';
export { AmbientBackground } from './components/AmbientBackground';
export { PageTransition } from './components/PageTransition';
export { RevealContainer } from './components/RevealContainer';
export { MicroFeedbackOverlay, useMicroFeedback } from './components/MicroFeedback';
export { EmotionResonance } from './components/EmotionResonance';
export { EnvironmentalStreak } from './components/EnvironmentalStreak';
export { SeasonalThemeOverlay, useSeasonalTheme, SEASONS } from './components/SeasonalTheme';
export { AchievementHall } from './components/AchievementHall';
export { ImmersiveOnboarding } from './components/ImmersiveOnboarding';
export { ProgressionAura } from './components/ProgressionAura';

// ── Services ───────────────────────────────────────────────────
export { audioEngine } from './services/AudioEngine';
