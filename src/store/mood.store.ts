import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrsAnswer {
  id: string;
  value: 0 | 1 | 2 | 3;
}

export interface BlendState {
  joy: number;
  calm: number;
  energy: number;
  focus: number;
}

export interface HumeSummary {
  frustration_index?: number;
  focus_index?: number;
  samples?: Array<{ t: number; emo: string; conf: number }>;
}

interface MoodStoreState {
  sessionId: string | null;
  status: 'idle' | 'starting' | 'active' | 'ending' | 'completed';
  cards: string[];
  blend: BlendState;
  trackUrl: string | null;
  wsUrl: string | null;
  answers: BrsAnswer[];
  humeSummary: HumeSummary | null;
  isPlaying: boolean;
  currentPromptId: string | null;
}

interface MoodStoreActions {
  startSession: (sessionId: string, wsUrl?: string) => void;
  endSession: () => void;
  setCards: (cards: string[]) => void;
  updateBlend: (blend: Partial<BlendState>) => void;
  setTrackUrl: (url: string) => void;
  addAnswer: (answer: BrsAnswer) => void;
  setHumeSummary: (summary: HumeSummary) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentPrompt: (promptId: string | null) => void;
  reset: () => void;
}

type MoodStore = MoodStoreState & MoodStoreActions;

const initialState: MoodStoreState = {
  sessionId: null,
  status: 'idle',
  cards: [],
  blend: { joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 },
  trackUrl: null,
  wsUrl: null,
  answers: [],
  humeSummary: null,
  isPlaying: false,
  currentPromptId: null,
};

export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      startSession: (sessionId: string, wsUrl?: string) => {
        set({
          sessionId,
          status: 'starting',
          wsUrl: wsUrl || null,
          answers: [],
          humeSummary: null,
        });
      },
      
      endSession: () => {
        const state = get();
        if (state.status === 'active' || state.status === 'starting') {
          set({
            status: 'ending',
            isPlaying: false,
          });
        }
      },
      
      setCards: (cards: string[]) => {
        set({ cards });
        
        // Auto-update blend based on cards
        const blend = cards.reduce((acc, card) => {
          switch (card) {
            case 'joy':
              acc.joy = Math.min(1, acc.joy + 0.3);
              break;
            case 'calm':
              acc.calm = Math.min(1, acc.calm + 0.3);
              break;
            case 'energy':
              acc.energy = Math.min(1, acc.energy + 0.3);
              break;
            case 'focus':
              acc.focus = Math.min(1, acc.focus + 0.3);
              break;
          }
          return acc;
        }, { ...get().blend });
        
        set({ blend });
      },
      
      updateBlend: (newBlend: Partial<BlendState>) => {
        const state = get();
        set({
          blend: { ...state.blend, ...newBlend }
        });
      },
      
      setTrackUrl: (url: string) => {
        set({ 
          trackUrl: url,
          status: 'active'
        });
      },
      
      addAnswer: (answer: BrsAnswer) => {
        const state = get();
        const existingIndex = state.answers.findIndex(a => a.id === answer.id);
        
        if (existingIndex >= 0) {
          const newAnswers = [...state.answers];
          newAnswers[existingIndex] = answer;
          set({ answers: newAnswers });
        } else {
          set({
            answers: [...state.answers, answer]
          });
        }
      },
      
      setHumeSummary: (summary: HumeSummary) => {
        set({ humeSummary: summary });
      },
      
      setIsPlaying: (playing: boolean) => {
        set({ isPlaying: playing });
      },
      
      setCurrentPrompt: (promptId: string | null) => {
        set({ currentPromptId: promptId });
      },
      
      reset: () => {
        set({
          ...initialState,
          sessionId: get().sessionId, // Keep session ID during reset
        });
      },
    }),
    {
      name: 'mood-store',
      partialize: (state) => ({
        sessionId: state.sessionId,
        cards: state.cards,
        blend: state.blend,
        answers: state.answers,
      }),
    }
  )
);