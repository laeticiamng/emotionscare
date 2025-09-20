import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type GlowPattern = '4-2-4' | '4-6-8' | '5-5';

export type GlowEvent = { 
  t: number; 
  type: 'start' | 'pause' | 'resume' | 'finish'; 
};

export type SelfReport = { 
  energized?: boolean; 
  calm?: 'non' | 'plutot' | 'oui'; 
};

export type GlowPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'paused' | 'finished';

interface GlowState {
  pattern: GlowPattern;
  phase: GlowPhase;
  running: boolean;
  paused: boolean;
  startedAt: number | null;
  duration: number;
  currentCycle: number;
  totalCycles: number;
  events: GlowEvent[];
  selfReport: SelfReport;
  badgeId: string | null;
  reduceMotion: boolean;
  enableSound: boolean;
  enableHaptic: boolean;
}

interface GlowActions {
  setPattern: (pattern: GlowPattern) => void;
  setPhase: (phase: GlowPhase) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  addEvent: (event: Omit<GlowEvent, 't'>) => void;
  updateSelfReport: (report: Partial<SelfReport>) => void;
  setBadge: (badgeId: string) => void;
  setReduceMotion: (reduce: boolean) => void;
  setEnableSound: (enable: boolean) => void;
  setEnableHaptic: (enable: boolean) => void;
  incrementCycle: () => void;
  reset: () => void;
}

type GlowStore = GlowState & GlowActions;

const initialState: GlowState = {
  pattern: '4-6-8',
  phase: 'idle',
  running: false,
  paused: false,
  startedAt: null,
  duration: 0,
  currentCycle: 0,
  totalCycles: 0,
  events: [],
  selfReport: {},
  badgeId: null,
  reduceMotion: false,
  enableSound: true,
  enableHaptic: true,
};

const useGlowStoreBase = create<GlowStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setPattern: (pattern: GlowPattern) => {
        set({ pattern });
      },
      
      setPhase: (phase: GlowPhase) => {
        set({ phase });
      },
      
      start: () => {
        const now = Date.now();
        set({ 
          running: true, 
          paused: false, 
          startedAt: now, 
          phase: 'inhale',
          currentCycle: 0,
          events: [{ t: 0, type: 'start' }]
        });
      },
      
      pause: () => {
        const state = get();
        if (state.running && !state.paused) {
          const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;
          set({ 
            paused: true, 
            phase: 'paused',
            events: [...state.events, { t: Math.floor(elapsed / 1000), type: 'pause' }]
          });
        }
      },
      
      resume: () => {
        const state = get();
        if (state.running && state.paused) {
          const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;
          set({ 
            paused: false, 
            phase: 'inhale',
            events: [...state.events, { t: Math.floor(elapsed / 1000), type: 'resume' }]
          });
        }
      },
      
      stop: () => {
        const state = get();
        const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;
        set({ 
          running: false, 
          paused: false, 
          phase: 'finished',
          duration: Math.floor(elapsed / 1000),
          events: [...state.events, { t: Math.floor(elapsed / 1000), type: 'finish' }]
        });
      },
      
      addEvent: (event: Omit<GlowEvent, 't'>) => {
        const state = get();
        const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;
        const newEvent: GlowEvent = { ...event, t: Math.floor(elapsed / 1000) };
        set({ events: [...state.events, newEvent] });
      },
      
      updateSelfReport: (report: Partial<SelfReport>) => {
        set((state) => ({ 
          selfReport: { ...state.selfReport, ...report } 
        }));
      },
      
      setBadge: (badgeId: string) => {
        set({ badgeId });
      },
      
      setReduceMotion: (reduceMotion: boolean) => {
        set({ reduceMotion });
      },
      
      setEnableSound: (enableSound: boolean) => {
        set({ enableSound });
      },
      
      setEnableHaptic: (enableHaptic: boolean) => {
        set({ enableHaptic });
      },
      
      incrementCycle: () => {
        set((state) => ({ 
          currentCycle: state.currentCycle + 1,
          totalCycles: Math.max(state.totalCycles, state.currentCycle + 1)
        }));
      },
      
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'glow-store',
      partialize: (state) => ({
        pattern: state.pattern,
        reduceMotion: state.reduceMotion,
        enableSound: state.enableSound,
        enableHaptic: state.enableHaptic,
      }),
    }
  )
);

export const useGlowStore = createSelectors(useGlowStoreBase);
