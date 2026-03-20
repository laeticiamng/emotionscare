/**
 * Experience Layer — Zustand Store
 * Central state for ambient, immersion, transitions, audio, and feedback.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  AmbientPalette,
  AmbientState,
  BreathPhase,
  DeviceTier,
  ExperiencePreferences,
  FeedbackEvent,
  ImmersionLevel,
  MoodType,
  TimeOfDay,
  TransitionConfig,
} from '../types';
import {
  getAmbientPalette,
  getLightIntensity,
  getFogDensity,
  getMotionIntensity,
} from '../config/palettes';

/* ── Helpers ─────────────────────────────────────────────────── */

function detectTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'medium';
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return 'low';
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  if (width < 768 || dpr < 1.5) return 'low';
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return 'low';
  if (width < 1200) return 'medium';
  return 'high';
}

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/* ── Store Interface ─────────────────────────────────────────── */

interface ExperienceStore {
  // Ambient state
  ambient: AmbientState;

  // Device
  deviceTier: DeviceTier;

  // Current page immersion
  currentImmersionLevel: ImmersionLevel;
  currentTransition: TransitionConfig;

  // Active feedback events (short-lived)
  activeFeedback: FeedbackEvent | null;

  // User preferences
  preferences: ExperiencePreferences;

  // Actions
  setMood: (mood: MoodType) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setImmersionLevel: (level: ImmersionLevel) => void;
  setTransition: (config: TransitionConfig) => void;
  setBreathPhase: (phase: BreathPhase | null) => void;
  triggerFeedback: (event: FeedbackEvent) => void;
  clearFeedback: () => void;
  updatePreferences: (prefs: Partial<ExperiencePreferences>) => void;
  refreshTimeOfDay: () => void;
  refreshDeviceTier: () => void;
}

/* ── Compute Ambient ─────────────────────────────────────────── */

function computeAmbient(
  mood: MoodType,
  timeOfDay: TimeOfDay,
  reducedMotion: boolean,
  breathPhase: BreathPhase | null
): AmbientState {
  return {
    mood,
    timeOfDay,
    palette: getAmbientPalette(mood, timeOfDay),
    lightIntensity: getLightIntensity(mood, timeOfDay),
    fogDensity: getFogDensity(mood, timeOfDay),
    motionIntensity: reducedMotion ? 0 : getMotionIntensity(mood),
    breathPhase,
  };
}

/* ── Store ───────────────────────────────────────────────────── */

const initialMood: MoodType = 'neutral';
const initialTime = detectTimeOfDay();
const initialReduced = detectReducedMotion();

export const useExperienceStore = create<ExperienceStore>()(
  subscribeWithSelector((set, get) => ({
    ambient: computeAmbient(initialMood, initialTime, initialReduced, null),
    deviceTier: detectDeviceTier(),
    currentImmersionLevel: 0,
    currentTransition: { type: 'cut' as const, duration: 0 },
    activeFeedback: null,
    preferences: {
      reducedMotion: initialReduced,
      ambientAudioEnabled: false,
      maxImmersionLevel: 3 as ImmersionLevel,
      masterVolume: 0.5,
    },

    setMood: (mood) => {
      const { ambient, preferences } = get();
      set({
        ambient: computeAmbient(mood, ambient.timeOfDay, preferences.reducedMotion, ambient.breathPhase),
      });
    },

    setTimeOfDay: (time) => {
      const { ambient, preferences } = get();
      set({
        ambient: computeAmbient(ambient.mood, time, preferences.reducedMotion, ambient.breathPhase),
      });
    },

    setImmersionLevel: (level) => {
      const { preferences } = get();
      const effective = Math.min(level, preferences.maxImmersionLevel) as ImmersionLevel;
      set({ currentImmersionLevel: effective });
    },

    setTransition: (config) => set({ currentTransition: config }),

    setBreathPhase: (phase) => {
      const { ambient, preferences } = get();
      set({
        ambient: computeAmbient(ambient.mood, ambient.timeOfDay, preferences.reducedMotion, phase),
      });
    },

    triggerFeedback: (event) => {
      set({ activeFeedback: event });
      // Auto-clear after duration
      const duration = event.duration ?? 800;
      setTimeout(() => {
        const current = get().activeFeedback;
        if (current === event) {
          set({ activeFeedback: null });
        }
      }, duration);
    },

    clearFeedback: () => set({ activeFeedback: null }),

    updatePreferences: (prefs) => {
      const { preferences, ambient } = get();
      const next = { ...preferences, ...prefs };
      set({ preferences: next });
      // Recompute ambient if reducedMotion changed
      if (prefs.reducedMotion !== undefined) {
        set({
          ambient: computeAmbient(ambient.mood, ambient.timeOfDay, next.reducedMotion, ambient.breathPhase),
        });
      }
    },

    refreshTimeOfDay: () => {
      const time = detectTimeOfDay();
      const { ambient, preferences } = get();
      if (time !== ambient.timeOfDay) {
        set({
          ambient: computeAmbient(ambient.mood, time, preferences.reducedMotion, ambient.breathPhase),
        });
      }
    },

    refreshDeviceTier: () => {
      set({ deviceTier: detectDeviceTier() });
    },
  }))
);
