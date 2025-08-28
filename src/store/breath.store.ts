import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  // Session state
  pattern: Pattern;
  duration: number; // seconds
  running: boolean;
  paused: boolean;
  finished: boolean;
  startedAt: number | null;
  elapsed: number;
  
  // Breath state
  phase: Phase | null;
  phaseProgress: number; // 0-1
  cycleCount: number;
  
  // Settings
  reduceMotion: boolean;
  hapticEnabled: boolean;
  voiceEnabled: boolean;
  
  // Events for metrics
  events: BreathEvent[];
  badgeEarned?: string;
  
  // Actions
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
  duration: 180, // 3 minutes default
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

export const useBreathStore = create<BreathState>()(
  persist(
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
      
      reset: () => set({
        ...initialState,
        // Keep preferences
        reduceMotion: get().reduceMotion,
        hapticEnabled: get().hapticEnabled,
        voiceEnabled: get().voiceEnabled,
      }),
    }),
    {
      name: 'breath-store',
      partialize: (state) => ({
        pattern: state.pattern,
        duration: state.duration,
        reduceMotion: state.reduceMotion,
        hapticEnabled: state.hapticEnabled,
        voiceEnabled: state.voiceEnabled,
      }),
    }
  )
);

// Detect reduced motion preference
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  // Set initial value
  useBreathStore.getState().setReduceMotion(mediaQuery.matches);
  
  // Listen for changes
  mediaQuery.addEventListener('change', (e) => {
    useBreathStore.getState().setReduceMotion(e.matches);
  });
}
