// @ts-nocheck
import { create } from 'zustand';

import { createImmutableStore } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type Pattern = '4-6-8' | '5-5' | '4-2-4';
export type Phase = 'inhale' | 'hold' | 'exhale';
export type BreathEvent = { t: number; type: 'start' | 'pause' | 'resume' | 'finish' };

export interface BreathMetrics {
  pattern: Pattern;
  duration_sec: number;
  events: BreathEvent[];
  self_report?: { calm?: 'non' | 'plutot' | 'oui' };
}

interface BreathState {
  pattern: Pattern;
  duration: number; // seconds
  running: boolean;
  paused: boolean;
  finished: boolean;
  startedAt: number | null;
  elapsed: number;
  phase: Phase | null;
  phaseProgress: number; // 0-1
  cycleCount: number;
  reduceMotion: boolean;
  hapticEnabled: boolean;
  voiceEnabled: boolean;
  events: BreathEvent[];
  badgeEarned?: string;
  setPattern: (pattern: Pattern) => void;
  setDuration: (duration: number) => void;
  setRunning: (running: boolean) => void;
  setPaused: (paused: boolean) => void;
  setFinished: (finished: boolean) => void;
  setStartedAt: (timestamp: number | null) => void;
  setElapsed: (elapsed: number) => void;
  setPhase: (phase: Phase | null) => void;
  setPhaseProgress: (progress: number) => void;
  setCycleCount: (count: number) => void;
  setReduceMotion: (reduce: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  addEvent: (event: BreathEvent) => void;
  setBadgeEarned: (badge: string) => void;
  reset: () => void;
}

const initialState = {
  pattern: '4-6-8' as Pattern,
  duration: 180,
  running: false,
  paused: false,
  finished: false,
  startedAt: null,
  elapsed: 0,
  phase: null,
  phaseProgress: 0,
  cycleCount: 0,
  reduceMotion: false,
  hapticEnabled: false,
  voiceEnabled: false,
  events: [],
  badgeEarned: undefined,
};

const breathStoreBase = create<BreathState>()(
  createImmutableStore(
    (set, get) => ({
      ...initialState,
      setPattern: (pattern) => set({ pattern }),
      setDuration: (duration) => set({ duration }),
      setRunning: (running) => set({ running }),
      setPaused: (paused) => set({ paused }),
      setFinished: (finished) => set({ finished }),
      setStartedAt: (startedAt) => set({ startedAt }),
      setElapsed: (elapsed) => set({ elapsed }),
      setPhase: (phase) => set({ phase }),
      setPhaseProgress: (phaseProgress) => set({ phaseProgress }),
      setCycleCount: (cycleCount) => set({ cycleCount }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setHapticEnabled: (hapticEnabled) => set({ hapticEnabled }),
      setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      setBadgeEarned: (badgeEarned) => set({ badgeEarned }),
      reset: () =>
        set({
          ...initialState,
          reduceMotion: get().reduceMotion,
          hapticEnabled: get().hapticEnabled,
          voiceEnabled: get().voiceEnabled,
        }),
    }),
    {
      persist: {
        name: 'breath-store',
        partialize: (state) => ({
          pattern: state.pattern,
          duration: state.duration,
          reduceMotion: state.reduceMotion,
          hapticEnabled: state.hapticEnabled,
          voiceEnabled: state.voiceEnabled,
        }),
      },
    }
  )
);

export const useBreathStore = createSelectors(breathStoreBase);

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  useBreathStore.getState().setReduceMotion(mediaQuery.matches);
  mediaQuery.addEventListener('change', (event) => {
    useBreathStore.getState().setReduceMotion(event.matches);
  });
}
