import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type VRSafetyLevel = 'clear' | 'caution' | 'alert';
export type VRParticleMode = 'standard' | 'soft' | 'minimal';
export type VRExperienceMode = 'vr' | 'vr_soft' | '2d';
export type VRModePreference = 'auto' | 'soft' | '2d';
export type VRPomsTone = 'tense' | 'neutral' | 'soothed';

interface VRSafetyState {
  lastLevel: VRSafetyLevel | null;
  lastCheckAt?: string;
  fallbackEnabled: boolean;
  particleMode: VRParticleMode;
  prefersReducedMotion: boolean;
  pendingPrompt: boolean;
  modePreference: VRModePreference;
  nextAutoMode: VRExperienceMode;
  lastSSQSummary?: string;
  lastSSQLevel?: VRSafetyLevel | null;
  lastSSQAt?: string;
  lastPOMSSummary?: string;
  lastPOMSTone?: VRPomsTone | null;
  lastPOMSTensionAt?: string;
  ssqHintUsed: boolean;
  pomsHintUsed: boolean;
  lowPerformance: boolean;
  averageFps?: number;
  fallbackReason?: string | null;
  allowExtensionCTA: boolean;
  setPendingPrompt: (pending: boolean) => void;
  recordCheck: (level: VRSafetyLevel) => void;
  setPrefersReducedMotion: (value: boolean) => void;
  setModePreference: (preference: VRModePreference) => void;
  planAutoMode: (mode: VRExperienceMode, reason?: string) => void;
  recordSSQFeedback: (input: { level: VRSafetyLevel; summary: string; timestamp?: string }) => void;
  recordPOMSTensionFeedback: (input: { tone: VRPomsTone; summary: string; timestamp?: string }) => void;
  recordPerformanceSample: (fps: number) => void;
  markFallback: (reason: string) => void;
  shouldPromptSSQ: () => boolean;
  shouldPromptPOMSTension: () => boolean;
  setHintUsed: (kind: 'ssq' | 'poms', used: boolean) => void;
  resetSafety: () => void;
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

const defaultState: Omit<
  VRSafetyState,
  |
    'setPendingPrompt'
    | 'recordCheck'
    | 'setPrefersReducedMotion'
    | 'setModePreference'
    | 'planAutoMode'
    | 'recordSSQFeedback'
    | 'recordPOMSTensionFeedback'
    | 'recordPerformanceSample'
    | 'markFallback'
    | 'shouldPromptSSQ'
    | 'shouldPromptPOMSTension'
    | 'setHintUsed'
    | 'resetSafety'
> = {
  lastLevel: null,
  fallbackEnabled: false,
  particleMode: 'standard',
  prefersReducedMotion: false,
  pendingPrompt: false,
  modePreference: 'auto',
  nextAutoMode: 'vr',
  ssqHintUsed: false,
  pomsHintUsed: false,
  lowPerformance: false,
  fallbackReason: null,
  allowExtensionCTA: false,
};

const useVRSafetyStoreBase = create<VRSafetyState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setPendingPrompt: (pendingPrompt) => set({ pendingPrompt }),
      recordCheck: (level) => {
        const now = new Date().toISOString();
        const state = get();
        const prefersReducedMotion = state.prefersReducedMotion;
        const modePreference = state.modePreference;
        const lowPerformance = state.lowPerformance;

        const resolvedParticle: VRParticleMode = prefersReducedMotion
          ? 'minimal'
          : level === 'alert'
            ? 'minimal'
            : level === 'caution'
              ? 'soft'
              : modePreference === 'soft'
                ? 'soft'
                : 'standard';

        const autoMode: VRExperienceMode = level === 'alert' ? '2d' : level === 'caution' ? 'vr_soft' : 'vr';

        set({
          lastLevel: level,
          lastCheckAt: now,
          lastSSQLevel: level,
          fallbackEnabled: modePreference === '2d' || level === 'alert' || lowPerformance,
          particleMode: resolvedParticle,
          pendingPrompt: false,
          nextAutoMode: modePreference === 'auto' ? autoMode : state.nextAutoMode,
          fallbackReason: level === 'alert' ? 'ssq_alert' : state.fallbackReason,
        });
      },
      setPrefersReducedMotion: (prefersReducedMotion) => {
        const state = get();
        const resolvedParticle: VRParticleMode = prefersReducedMotion
          ? 'minimal'
          : state.lastLevel === 'caution' || state.modePreference === 'soft'
            ? 'soft'
            : state.lastLevel === 'alert'
              ? 'minimal'
              : 'standard';

        set({
          prefersReducedMotion,
          particleMode: resolvedParticle,
          modePreference: prefersReducedMotion ? 'soft' : state.modePreference,
          fallbackEnabled: prefersReducedMotion ? state.fallbackEnabled : state.fallbackEnabled,
        });
      },
      setModePreference: (preference) => {
        const state = get();
        const prefersReducedMotion = state.prefersReducedMotion;
        const resolvedParticle: VRParticleMode = prefersReducedMotion
          ? 'minimal'
          : preference === 'soft'
            ? 'soft'
            : state.lastLevel === 'caution'
              ? 'soft'
              : state.lastLevel === 'alert'
                ? 'minimal'
                : 'standard';

        set({
          modePreference: preference,
          fallbackEnabled: preference === '2d' || state.lastLevel === 'alert' || state.lowPerformance,
          particleMode: resolvedParticle,
          nextAutoMode:
            preference === 'auto'
              ? state.nextAutoMode
              : preference === 'soft'
                ? 'vr_soft'
                : '2d',
          fallbackReason: preference === '2d' ? state.fallbackReason ?? 'manual_toggle' : state.fallbackReason,
        });
      },
      planAutoMode: (mode, reason) => {
        const state = get();
        const modePreference = state.modePreference;
        set({
          nextAutoMode: modePreference === 'auto' ? mode : state.nextAutoMode,
          fallbackEnabled: mode === '2d' || modePreference === '2d' || state.lastLevel === 'alert' || state.lowPerformance,
          fallbackReason: mode === '2d' ? reason ?? state.fallbackReason ?? 'auto_plan' : state.fallbackReason,
        });
      },
      recordSSQFeedback: ({ level, summary, timestamp }) => {
        const state = get();
        const now = timestamp ?? new Date().toISOString();
        const prefersReducedMotion = state.prefersReducedMotion;
        const modePreference = state.modePreference;
        const lowPerformance = state.lowPerformance;

        const autoMode: VRExperienceMode = level === 'alert' ? '2d' : level === 'caution' ? 'vr_soft' : 'vr';
        const resolvedParticle: VRParticleMode = prefersReducedMotion
          ? 'minimal'
          : level === 'alert'
            ? 'minimal'
            : level === 'caution'
              ? 'soft'
              : modePreference === 'soft'
                ? 'soft'
                : 'standard';

        set({
          lastSSQAt: now,
          lastSSQSummary: summary,
          lastSSQLevel: level,
          pendingPrompt: false,
          ssqHintUsed: true,
          fallbackEnabled: modePreference === '2d' || level === 'alert' || lowPerformance,
          particleMode: resolvedParticle,
          nextAutoMode: modePreference === 'auto' ? autoMode : state.nextAutoMode,
          fallbackReason: level === 'alert' ? 'ssq_alert' : state.fallbackReason,
        });
      },
      recordPOMSTensionFeedback: ({ tone, summary, timestamp }) => {
        const state = get();
        const now = timestamp ?? new Date().toISOString();
        const prefersReducedMotion = state.prefersReducedMotion;
        const modePreference = state.modePreference;

        set({
          lastPOMSTensionAt: now,
          lastPOMSSummary: summary,
          lastPOMSTone: tone,
          pendingPrompt: false,
          pomsHintUsed: true,
          allowExtensionCTA: tone === 'soothed',
          nextAutoMode:
            modePreference === 'auto'
              ? tone === 'tense'
                ? 'vr_soft'
                : state.nextAutoMode
              : state.nextAutoMode,
          particleMode:
            prefersReducedMotion
              ? 'minimal'
              : tone === 'tense'
                ? 'soft'
                : state.modePreference === 'soft'
                  ? 'soft'
                  : state.lastLevel === 'alert'
                    ? 'minimal'
                    : state.particleMode,
        });
      },
      recordPerformanceSample: (fps) => {
        const state = get();
        const previous = state.averageFps;
        const nextAverage = Number((typeof previous === 'number' ? (previous + fps) / 2 : fps).toFixed(1));
        const lowPerformance = nextAverage < 28;
        const prefersReducedMotion = state.prefersReducedMotion;

        set({
          averageFps: nextAverage,
          lowPerformance,
          fallbackEnabled: lowPerformance || state.modePreference === '2d' || state.lastLevel === 'alert',
          fallbackReason: lowPerformance ? 'low_fps' : state.fallbackReason,
          nextAutoMode:
            lowPerformance && state.modePreference === 'auto' ? '2d' : state.nextAutoMode,
          particleMode: prefersReducedMotion ? 'minimal' : lowPerformance ? 'minimal' : state.particleMode,
        });
      },
      markFallback: (reason) => {
        const state = get();
        set({
          fallbackEnabled: true,
          fallbackReason: reason,
          nextAutoMode: '2d',
          particleMode: state.prefersReducedMotion ? 'minimal' : 'minimal',
        });
      },
      shouldPromptSSQ: () => {
        const last = get().lastSSQAt;
        if (!last) return true;
        return Date.now() - new Date(last).getTime() > COOLDOWN_MS;
      },
      shouldPromptPOMSTension: () => {
        const last = get().lastPOMSTensionAt;
        if (!last) return true;
        return Date.now() - new Date(last).getTime() > COOLDOWN_MS;
      },
      setHintUsed: (kind, used) => {
        if (kind === 'ssq') {
          set({ ssqHintUsed: used });
        } else {
          set({ pomsHintUsed: used });
        }
      },
      resetSafety: () =>
        set((prev) => ({
          ...defaultState,
          modePreference: prev.modePreference,
          prefersReducedMotion: prev.prefersReducedMotion,
          nextAutoMode: prev.nextAutoMode,
        })),
    }),
    {
      name: 'vr-safety-store',
      partialize: (state) => ({
        lastLevel: state.lastLevel,
        lastCheckAt: state.lastCheckAt,
        fallbackEnabled: state.fallbackEnabled,
        particleMode: state.particleMode,
        prefersReducedMotion: state.prefersReducedMotion,
        modePreference: state.modePreference,
        nextAutoMode: state.nextAutoMode,
        lastSSQSummary: state.lastSSQSummary,
        lastSSQLevel: state.lastSSQLevel,
        lastSSQAt: state.lastSSQAt,
        lastPOMSSummary: state.lastPOMSSummary,
        lastPOMSTone: state.lastPOMSTone,
        lastPOMSTensionAt: state.lastPOMSTensionAt,
        ssqHintUsed: state.ssqHintUsed,
        pomsHintUsed: state.pomsHintUsed,
        allowExtensionCTA: state.allowExtensionCTA,
      }),
    }
  )
);

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  useVRSafetyStore.getState().setPrefersReducedMotion(mediaQuery.matches);

  mediaQuery.addEventListener('change', (event) => {
    useVRSafetyStore.getState().setPrefersReducedMotion(event.matches);
  });
}

export const useVRSafetyStore = createSelectors(useVRSafetyStoreBase);
