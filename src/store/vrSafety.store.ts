import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VRSafetyLevel = 'clear' | 'caution' | 'alert';
export type VRParticleMode = 'standard' | 'soft' | 'minimal';

interface VRSafetyState {
  lastLevel: VRSafetyLevel | null;
  lastCheckAt?: string;
  fallbackEnabled: boolean;
  particleMode: VRParticleMode;
  prefersReducedMotion: boolean;
  pendingPrompt: boolean;
  setPendingPrompt: (pending: boolean) => void;
  recordCheck: (level: VRSafetyLevel) => void;
  setPrefersReducedMotion: (value: boolean) => void;
  resetSafety: () => void;
}

const defaultState: Omit<VRSafetyState, 'setPendingPrompt' | 'recordCheck' | 'setPrefersReducedMotion' | 'resetSafety'> = {
  lastLevel: null,
  fallbackEnabled: false,
  particleMode: 'standard',
  prefersReducedMotion: false,
  pendingPrompt: false,
};

export const useVRSafetyStore = create<VRSafetyState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setPendingPrompt: (pendingPrompt) => set({ pendingPrompt }),
      recordCheck: (level) => {
        const now = new Date().toISOString();
        const particleMode: VRParticleMode = (() => {
          switch (level) {
            case 'clear':
              return 'standard';
            case 'caution':
              return 'soft';
            case 'alert':
              return 'minimal';
            default:
              return 'standard';
          }
        })();

        const prefersReducedMotion = get().prefersReducedMotion;

        set({
          lastLevel: level,
          lastCheckAt: now,
          fallbackEnabled: level === 'alert',
          particleMode: prefersReducedMotion ? 'minimal' : particleMode,
          pendingPrompt: false,
        });
      },
      setPrefersReducedMotion: (prefersReducedMotion) => {
        const { lastLevel } = get();
        set({
          prefersReducedMotion,
          particleMode: prefersReducedMotion
            ? 'minimal'
            : lastLevel === 'caution'
              ? 'soft'
              : lastLevel === 'alert'
                ? 'minimal'
                : 'standard',
        });
      },
      resetSafety: () => set({ ...defaultState }),
    }),
    {
      name: 'vr-safety-store',
      partialize: (state) => ({
        lastLevel: state.lastLevel,
        lastCheckAt: state.lastCheckAt,
        fallbackEnabled: state.fallbackEnabled,
        particleMode: state.particleMode,
        prefersReducedMotion: state.prefersReducedMotion,
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
