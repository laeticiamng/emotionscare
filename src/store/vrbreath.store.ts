import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type VRBreathPattern = '4-2-4' | '4-6-8' | '5-5';

export interface VRBreathMetrics {
  pattern: VRBreathPattern;
  duration_sec: number;
  adherence: number; // 0..1, estimation locale silencieuse
  ts: number;
}

interface VRBreathState {
  // XR state
  xrSupported: boolean;
  inXR: boolean;
  
  // Session state
  pattern: VRBreathPattern;
  running: boolean;
  startedAt: number | null;
  
  // Preferences
  reduceMotion: boolean;
  audioEnabled: boolean;
  
  // Actions
  setXRSupported: (supported: boolean) => void;
  setInXR: (inXR: boolean) => void;
  setPattern: (pattern: VRBreathPattern) => void;
  setRunning: (running: boolean) => void;
  setStartedAt: (timestamp: number | null) => void;
  setReduceMotion: (reduce: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const initialState = {
  xrSupported: false,
  inXR: false,
  pattern: '4-6-8' as VRBreathPattern,
  running: false,
  startedAt: null,
  reduceMotion: false,
  audioEnabled: false, // Mute par défaut comme spécifié
};

const useVRBreathStoreBase = create<VRBreathState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setXRSupported: (xrSupported) => set({ xrSupported }),
      
      setInXR: (inXR) => {
        set({ inXR });
        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', inXR ? 'vrbreath_enter' : 'vrbreath_exit');
        }
      },
      
      setPattern: (pattern) => set({ pattern }),
      
      setRunning: (running) => {
        const state = get();
        set({ 
          running,
          startedAt: running ? Date.now() : state.startedAt
        });
      },
      
      setStartedAt: (startedAt) => set({ startedAt }),
      
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      
      setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
      
      reset: () => set({
        ...initialState,
        // Keep preferences
        reduceMotion: get().reduceMotion,
        audioEnabled: get().audioEnabled,
      }),
    }),
    {
      name: 'vrbreath-store',
      partialize: (state) => ({
        pattern: state.pattern,
        reduceMotion: state.reduceMotion,
        audioEnabled: state.audioEnabled,
      }),
    }
  )
);

// Detect reduced motion preference
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  // Set initial value
  useVRBreathStore.getState().setReduceMotion(mediaQuery.matches);
  
  // Listen for changes
  mediaQuery.addEventListener('change', (e) => {
    useVRBreathStore.getState().setReduceMotion(e.matches);
  });
}

export const useVRBreathStore = createSelectors(useVRBreathStoreBase);
