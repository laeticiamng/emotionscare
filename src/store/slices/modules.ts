import type { StateCreator } from 'zustand';
import type { AppState } from '../appStore';

export interface MusicModuleState {
  currentTrack: unknown | null;
  isPlaying: boolean;
  volume: number;
  playlist: unknown[];
  [key: string]: unknown;
}

export interface EmotionModuleState {
  currentMood: string | null;
  lastScan: unknown | null;
  history: unknown[];
  [key: string]: unknown;
}

export interface JournalModuleState {
  entries: unknown[];
  currentEntry: unknown | null;
  unsavedChanges: boolean;
  [key: string]: unknown;
}

export interface CoachModuleState {
  conversations: unknown[];
  activeConversation: string | null;
  suggestions: unknown[];
  [key: string]: unknown;
}

export interface ModulesState {
  modules: {
    music: MusicModuleState;
    emotion: EmotionModuleState;
    journal: JournalModuleState;
    coach: CoachModuleState;
  };
}

export interface ModulesActions {
  updateMusicState: (state: Partial<MusicModuleState>) => void;
  updateEmotionState: (state: Partial<EmotionModuleState>) => void;
  updateJournalState: (state: Partial<JournalModuleState>) => void;
  updateCoachState: (state: Partial<CoachModuleState>) => void;
}

export type ModulesSlice = ModulesState & ModulesActions;

export const createModulesInitialState = (): ModulesState => ({
  modules: {
    music: {
      currentTrack: null,
      isPlaying: false,
      volume: 0.7,
      playlist: [],
    },
    emotion: {
      currentMood: null,
      lastScan: null,
      history: [],
    },
    journal: {
      entries: [],
      currentEntry: null,
      unsavedChanges: false,
    },
    coach: {
      conversations: [],
      activeConversation: null,
      suggestions: [],
    },
  },
});

export const createModulesSlice: StateCreator<AppState, [], [], ModulesSlice> = (set) => ({
  ...createModulesInitialState(),
  updateMusicState: (musicState) =>
    set((state) => ({
      modules: {
        ...state.modules,
        music: { ...state.modules.music, ...musicState },
      },
    })),
  updateEmotionState: (emotionState) =>
    set((state) => ({
      modules: {
        ...state.modules,
        emotion: { ...state.modules.emotion, ...emotionState },
      },
    })),
  updateJournalState: (journalState) =>
    set((state) => ({
      modules: {
        ...state.modules,
        journal: { ...state.modules.journal, ...journalState },
      },
    })),
  updateCoachState: (coachState) =>
    set((state) => ({
      modules: {
        ...state.modules,
        coach: { ...state.modules.coach, ...coachState },
      },
    })),
});
