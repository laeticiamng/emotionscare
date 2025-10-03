import { create } from 'zustand';

export type VRPattern = '4-2-4' | '4-6-8' | '5-5';
export type VRBreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export type VRMetrics = {
  pattern: VRPattern;
  duration_sec: number;
  adherence: number; // 0..1, calculated client-side
  hrv?: any | null;
  ts: number;
};

interface VRState {
  // WebXR state
  xrSupported: boolean;
  inXR: boolean;
  sessionActive: boolean;
  
  // Session state
  running: boolean;
  paused: boolean;
  pattern: VRPattern;
  duration: number; // seconds
  startedAt: number | null;
  elapsedTime: number;
  
  // Breathing state
  phase: VRBreathPhase;
  phaseProgress: number; // 0-1
  cycleCount: number;
  adherence: number; // calculated adherence score
  
  // Settings
  reduceMotion: boolean;
  musicEnabled: boolean;
  
  // HRV
  hrvEnabled: boolean;
  hrvActive: boolean;
  
  // Actions
  setXRSupported: (supported: boolean) => void;
  setInXR: (inXR: boolean) => void;
  setSessionActive: (active: boolean) => void;
  
  setPattern: (pattern: VRPattern) => void;
  setDuration: (duration: number) => void;
  setReduceMotion: (reduce: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setHRVEnabled: (enabled: boolean) => void;
  setHRVActive: (active: boolean) => void;
  
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  
  updatePhase: (phase: VRBreathPhase, progress: number) => void;
  updateElapsedTime: (elapsed: number) => void;
  updateAdherence: (adherence: number) => void;
  
  getMetrics: () => VRMetrics;
}

// VR Pattern timing configurations (in seconds)
export const VR_PATTERN_TIMINGS: Record<VRPattern, { inhale: number; hold: number; exhale: number; pause: number }> = {
  '4-2-4': { inhale: 4, hold: 2, exhale: 4, pause: 0 },
  '4-6-8': { inhale: 4, hold: 6, exhale: 8, pause: 0 },
  '5-5': { inhale: 5, hold: 0, exhale: 5, pause: 0 },
};

export const useVRStore = create<VRState>((set, get) => ({
  // Initial state
  xrSupported: false,
  inXR: false,
  sessionActive: false,
  
  running: false,
  paused: false,
  pattern: '4-6-8',
  duration: 180, // 3 minutes default for VR
  startedAt: null,
  elapsedTime: 0,
  
  phase: 'inhale',
  phaseProgress: 0,
  cycleCount: 0,
  adherence: 0,
  
  reduceMotion: false,
  musicEnabled: false,
  
  hrvEnabled: false,
  hrvActive: false,
  
  // Actions
  setXRSupported: (xrSupported) => set({ xrSupported }),
  setInXR: (inXR) => set({ inXR }),
  setSessionActive: (sessionActive) => set({ sessionActive }),
  
  setPattern: (pattern) => set({ pattern }),
  setDuration: (duration) => set({ duration }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
  setHRVEnabled: (hrvEnabled) => set({ hrvEnabled }),
  setHRVActive: (hrvActive) => set({ hrvActive }),
  
  start: () => {
    const now = Date.now();
    set({
      running: true,
      paused: false,
      startedAt: now,
      elapsedTime: 0,
      phase: 'inhale',
      phaseProgress: 0,
      cycleCount: 0,
      adherence: 0,
    });
  },
  
  pause: () => {
    const state = get();
    if (state.running && !state.paused) {
      set({ paused: true });
    }
  },
  
  resume: () => {
    const state = get();
    if (state.running && state.paused) {
      set({ paused: false });
    }
  },
  
  stop: () => {
    set({
      running: false,
      paused: false,
    });
  },
  
  reset: () => set({
    running: false,
    paused: false,
    startedAt: null,
    elapsedTime: 0,
    phase: 'inhale',
    phaseProgress: 0,
    cycleCount: 0,
    adherence: 0,
  }),
  
  updatePhase: (phase, progress) => {
    const state = get();
    set({ 
      phase, 
      phaseProgress: progress,
      cycleCount: phase === 'inhale' && progress === 0 ? state.cycleCount + 1 : state.cycleCount
    });
  },
  
  updateElapsedTime: (elapsedTime) => set({ elapsedTime }),
  
  updateAdherence: (adherence) => set({ adherence }),
  
  getMetrics: () => {
    const state = get();
    return {
      pattern: state.pattern,
      duration_sec: state.elapsedTime,
      adherence: state.adherence,
      hrv: state.hrvActive ? {} : null, // Will be populated by HRV hook
      ts: Date.now(),
    };
  },
}));