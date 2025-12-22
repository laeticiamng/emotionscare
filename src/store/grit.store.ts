import { create } from 'zustand';

import { createImmutableStore } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export interface GritEvent {
  t: number;
  type: 'start' | 'pause' | 'resume' | 'abort' | 'finish';
  reason?: string;
}

export interface HumeSummary {
  frustration_index?: number;
  focus_index?: number;
  samples?: Array<{ t: number; emo: string; conf: number }>;
}

interface GritStoreState {
  questId: string | null;
  startedAt: number | null;
  status: 'idle' | 'loading' | 'active' | 'paused' | 'completed' | 'aborted';
  pauseCount: number;
  events: GritEvent[];
  elapsedTime: number;
  humeSummary: HumeSummary | null;
}

interface GritStoreActions {
  startQuest: (questId: string) => void;
  pauseQuest: () => void;
  resumeQuest: () => void;
  finishQuest: () => void;
  abortQuest: (reason?: string) => void;
  addEvent: (event: Omit<GritEvent, 't'>) => void;
  updateElapsedTime: (time: number) => void;
  setHumeSummary: (summary: HumeSummary) => void;
  reset: () => void;
}

type GritStore = GritStoreState & GritStoreActions;

const initialState: GritStoreState = {
  questId: null,
  startedAt: null,
  status: 'idle',
  pauseCount: 0,
  events: [],
  elapsedTime: 0,
  humeSummary: null,
};

const gritStoreBase = create<GritStore>()(
  createImmutableStore(
    (set, get) => ({
      ...initialState,
      startQuest: (questId: string) => {
        const now = Date.now();
        set({
          questId,
          startedAt: now,
          status: 'active',
          pauseCount: 0,
          events: [{ t: now, type: 'start' }],
          elapsedTime: 0,
          humeSummary: null,
        });
      },
      pauseQuest: () => {
        const state = get();
        if (state.status === 'active' && state.pauseCount < 1) {
          const now = Date.now();
          set({
            status: 'paused',
            pauseCount: state.pauseCount + 1,
            events: [...state.events, { t: now, type: 'pause' }],
          });
        }
      },
      resumeQuest: () => {
        const state = get();
        if (state.status === 'paused') {
          const now = Date.now();
          set({
            status: 'active',
            events: [...state.events, { t: now, type: 'resume' }],
          });
        }
      },
      finishQuest: () => {
        const state = get();
        if (state.status === 'active' || state.status === 'paused') {
          const now = Date.now();
          set({
            status: 'completed',
            events: [...state.events, { t: now, type: 'finish' }],
          });
        }
      },
      abortQuest: (reason?: string) => {
        const state = get();
        if (state.status === 'active' || state.status === 'paused') {
          const now = Date.now();
          set({
            status: 'aborted',
            events: [...state.events, { t: now, type: 'abort', reason }],
          });
        }
      },
      addEvent: (eventData) => {
        const state = get();
        const event: GritEvent = { ...eventData, t: Date.now() };
        set({ events: [...state.events, event] });
      },
      updateElapsedTime: (time: number) => set({ elapsedTime: time }),
      setHumeSummary: (summary: HumeSummary) => set({ humeSummary: summary }),
      reset: () => set(initialState),
    }),
    {
      persist: {
        name: 'grit-store',
        partialize: (state) => ({
          questId: state.questId,
          startedAt: state.startedAt,
          status: state.status,
          pauseCount: state.pauseCount,
          events: state.events,
          elapsedTime: state.elapsedTime,
        }),
      },
    }
  )
);

export const useGritStore = createSelectors(gritStoreBase);
