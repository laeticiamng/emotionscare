// @ts-nocheck
import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type StoryChoice = { 
  id: string; 
  label: string; 
};

export type StoryChapter = { 
  id: string; 
  text: string; 
  art_url?: string; 
};

export type StoryMusic = { 
  track_url: string; 
};

export type StoryEvent =
  | { type: 'chapter'; payload: StoryChapter }
  | { type: 'choices'; payload: { items: StoryChoice[] } }
  | { type: 'music'; payload: StoryMusic }
  | { type: 'prompt'; payload: { id: string; text: string } };

export type StoryGenre = 'space' | 'medieval' | 'cyber';
export type StoryPhase = 'idle' | 'starting' | 'streaming' | 'choosing' | 'exporting' | 'finished';

interface StoryState {
  sessionId: string | null;
  genre: StoryGenre | null;
  phase: StoryPhase;
  chapter: StoryChapter | null;
  choices: StoryChoice[];
  music: StoryMusic | null;
  coverUrl: string | null;
  sseUrl: string | null;
  chapters: StoryChapter[];
  currentAct: number;
  isConnected: boolean;
  error: string | null;
  exportUrl: string | null;
  transcriptUrl: string | null;
}

interface StoryActions {
  setSessionData: (sessionId: string, coverUrl: string, sseUrl: string) => void;
  setGenre: (genre: StoryGenre) => void;
  setPhase: (phase: StoryPhase) => void;
  addChapter: (chapter: StoryChapter) => void;
  setChoices: (choices: StoryChoice[]) => void;
  setMusic: (music: StoryMusic) => void;
  setConnection: (connected: boolean) => void;
  setError: (error: string | null) => void;
  setExportUrls: (exportUrl: string, transcriptUrl: string) => void;
  reset: () => void;
}

type StoryStore = StoryState & StoryActions;

const initialState: StoryState = {
  sessionId: null,
  genre: null,
  phase: 'idle',
  chapter: null,
  choices: [],
  music: null,
  coverUrl: null,
  sseUrl: null,
  chapters: [],
  currentAct: 1,
  isConnected: false,
  error: null,
  exportUrl: null,
  transcriptUrl: null,
};

const useStoryStoreBase = create<StoryStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setSessionData: (sessionId: string, coverUrl: string, sseUrl: string) => {
        set({ sessionId, coverUrl, sseUrl, phase: 'streaming' });
      },
      
      setGenre: (genre: StoryGenre) => {
        set({ genre });
      },
      
      setPhase: (phase: StoryPhase) => {
        set({ phase });
      },
      
      addChapter: (chapter: StoryChapter) => {
        const state = get();
        set({ 
          chapter,
          chapters: [...state.chapters, chapter],
          currentAct: Math.min(3, Math.floor(state.chapters.length / 2) + 1),
          phase: 'choosing'
        });
      },
      
      setChoices: (choices: StoryChoice[]) => {
        set({ choices });
      },
      
      setMusic: (music: StoryMusic) => {
        set({ music });
      },
      
      setConnection: (isConnected: boolean) => {
        set({ isConnected });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      setExportUrls: (exportUrl: string, transcriptUrl: string) => {
        set({ exportUrl, transcriptUrl, phase: 'finished' });
      },
      
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'story-store',
      partialize: (state) => ({
        sessionId: state.sessionId,
        genre: state.genre,
        chapters: state.chapters,
        currentAct: state.currentAct,
      }),
    }
  )
);

export const useStoryStore = createSelectors(useStoryStoreBase);
