// @ts-nocheck
import { create } from 'zustand';

export type SilkPattern = '4-2-4' | '4-6-8' | '5-5';
export type SilkEventType = 'start' | 'pause' | 'resume' | 'finish';
export type SilkEvent = { t: number; type: SilkEventType };

export type HRVPayload = {
  rr_before_ms?: number[] | null;
  rr_during_ms?: number[] | null;
  rr_after_ms?: number[] | null;
};

export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface ScreenSilkState {
  // Session state
  running: boolean;
  paused: boolean;
  pattern: SilkPattern;
  duration: number; // seconds
  startedAt: number | null;
  elapsedTime: number;
  events: SilkEvent[];
  
  // Breathing state
  phase: BreathPhase;
  phaseProgress: number; // 0-1
  cycleCount: number;
  
  // Settings
  reduceMotion: boolean;
  audioEnabled: boolean;
  
  // HRV
  hrvEnabled: boolean;
  hrvActive: boolean;
  
  // Actions
  setPattern: (pattern: SilkPattern) => void;
  setDuration: (duration: number) => void;
  setReduceMotion: (reduce: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setHRVEnabled: (enabled: boolean) => void;
  setHRVActive: (active: boolean) => void;
  
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  
  updatePhase: (phase: BreathPhase, progress: number) => void;
  updateElapsedTime: (elapsed: number) => void;
  addEvent: (event: SilkEvent) => void;
}

// Pattern timing configurations (in seconds)
export const PATTERN_TIMINGS: Record<SilkPattern, { inhale: number; hold: number; exhale: number; pause: number }> = {
  '4-2-4': { inhale: 4, hold: 2, exhale: 4, pause: 0 },
  '4-6-8': { inhale: 4, hold: 6, exhale: 8, pause: 0 },
  '5-5': { inhale: 5, hold: 0, exhale: 5, pause: 0 },
};

export const useScreenSilkStore = create<ScreenSilkState>((set, get) => ({
  // Initial state
  running: false,
  paused: false,
  pattern: '4-6-8',
  duration: 120, // 2 minutes default
  startedAt: null,
  elapsedTime: 0,
  events: [],
  
  phase: 'inhale',
  phaseProgress: 0,
  cycleCount: 0,
  
  reduceMotion: false,
  audioEnabled: false,
  
  hrvEnabled: false,
  hrvActive: false,
  
  // Actions
  setPattern: (pattern) => set({ pattern }),
  setDuration: (duration) => set({ duration }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
  setHRVEnabled: (hrvEnabled) => set({ hrvEnabled }),
  setHRVActive: (hrvActive) => set({ hrvActive }),
  
  start: () => {
    const now = Date.now();
    set({
      running: true,
      paused: false,
      startedAt: now,
      elapsedTime: 0,
      events: [{ t: 0, type: 'start' }],
      phase: 'inhale',
      phaseProgress: 0,
      cycleCount: 0,
    });
  },
  
  pause: () => {
    const state = get();
    if (state.running && !state.paused) {
      set({
        paused: true,
        events: [...state.events, { t: state.elapsedTime, type: 'pause' }],
      });
    }
  },
  
  resume: () => {
    const state = get();
    if (state.running && state.paused) {
      set({
        paused: false,
        events: [...state.events, { t: state.elapsedTime, type: 'resume' }],
      });
    }
  },
  
  stop: () => {
    const state = get();
    set({
      running: false,
      paused: false,
      events: [...state.events, { t: state.elapsedTime, type: 'finish' }],
    });
  },
  
  reset: () => set({
    running: false,
    paused: false,
    startedAt: null,
    elapsedTime: 0,
    events: [],
    phase: 'inhale',
    phaseProgress: 0,
    cycleCount: 0,
  }),
  
  updatePhase: (phase, progress) => set({ phase, phaseProgress: progress }),
  
  updateElapsedTime: (elapsedTime) => set({ elapsedTime }),
  
  addEvent: (event) => {
    const state = get();
    set({ events: [...state.events, event] });
  },
}));