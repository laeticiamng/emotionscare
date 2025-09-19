import { create } from 'zustand';
import { devtools, persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

// Types pour le store global
export interface User {
  id: string;
  email: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  profile?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface AppState {
  // Authentification
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // UI State
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  activeModule: string | null;

  // Cache
  cache: Record<string, unknown>;
  cacheTimestamps: Record<string, number>;

  // Préférences utilisateur
  preferences: {
    language: 'fr' | 'en';
    notifications: boolean;
    autoSave: boolean;
    analyticsEnabled: boolean;
  };

  // État des modules
  modules: {
    music: {
      currentTrack: unknown | null;
      isPlaying: boolean;
      volume: number;
      playlist: unknown[];
    };
    emotion: {
      currentMood: string | null;
      lastScan: unknown | null;
      history: unknown[];
    };
    journal: {
      entries: unknown[];
      currentEntry: unknown | null;
      unsavedChanges: boolean;
    };
    coach: {
      conversations: unknown[];
      activeConversation: string | null;
      suggestions: unknown[];
    };
  };
}

export interface AppActions {
  // Authentification
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;

  // UI Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setActiveModule: (module: string | null) => void;

  // Cache Actions
  setCache: (key: string, value: unknown) => void;
  getCache: (key: string) => unknown;
  clearCache: (key?: string) => void;
  isCacheValid: (key: string, maxAge?: number) => boolean;

  // Préférences
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void;

  // Modules Actions
  updateMusicState: (state: Partial<AppState['modules']['music']>) => void;
  updateEmotionState: (state: Partial<AppState['modules']['emotion']>) => void;
  updateJournalState: (state: Partial<AppState['modules']['journal']>) => void;
  updateCoachState: (state: Partial<AppState['modules']['coach']>) => void;

  // Reset
  reset: () => void;
}

export type AppStore = AppState & AppActions;

const createDefaultState = (): AppState => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  theme: 'system',
  sidebarCollapsed: false,
  activeModule: null,
  cache: {},
  cacheTimestamps: {},
  preferences: {
    language: 'fr',
    notifications: true,
    autoSave: true,
    analyticsEnabled: true,
  },
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

const store = persist<AppStore>(
  (set, get) => ({
    ...createDefaultState(),

    // Authentification Actions
    setUser: (user) =>
      set((state) => ({
        ...state,
        user,
      })),

    setAuthenticated: (isAuthenticated) =>
      set((state) => ({
        ...state,
        isAuthenticated,
      })),

    setLoading: (isLoading) =>
      set((state) => ({
        ...state,
        isLoading,
      })),

    // UI Actions
    setTheme: (theme) =>
      set((state) => ({
        ...state,
        theme,
      })),

    toggleSidebar: () =>
      set((state) => ({
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      })),

    setActiveModule: (module) =>
      set((state) => ({
        ...state,
        activeModule: module,
      })),

    // Cache Actions
    setCache: (key, value) =>
      set((state) => ({
        ...state,
        cache: { ...state.cache, [key]: value },
        cacheTimestamps: { ...state.cacheTimestamps, [key]: Date.now() },
      })),

    getCache: (key) => get().cache[key],

    clearCache: (key) =>
      set((state) => {
        if (!key) {
          return {
            ...state,
            cache: {},
            cacheTimestamps: {},
          };
        }

        const { [key]: _, ...restCache } = state.cache;
        const { [key]: __, ...restTimestamps } = state.cacheTimestamps;

        return {
          ...state,
          cache: restCache,
          cacheTimestamps: restTimestamps,
        };
      }),

    isCacheValid: (key, maxAge = 5 * 60 * 1000) => {
      const timestamp = get().cacheTimestamps[key];
      return typeof timestamp === 'number' && Date.now() - timestamp < maxAge;
    },

    // Préférences
    updatePreferences: (preferences) =>
      set((state) => ({
        ...state,
        preferences: { ...state.preferences, ...preferences },
      })),

    // Modules Actions
    updateMusicState: (musicState) =>
      set((state) => ({
        ...state,
        modules: {
          ...state.modules,
          music: { ...state.modules.music, ...musicState },
        },
      })),

    updateEmotionState: (emotionState) =>
      set((state) => ({
        ...state,
        modules: {
          ...state.modules,
          emotion: { ...state.modules.emotion, ...emotionState },
        },
      })),

    updateJournalState: (journalState) =>
      set((state) => ({
        ...state,
        modules: {
          ...state.modules,
          journal: { ...state.modules.journal, ...journalState },
        },
      })),

    updateCoachState: (coachState) =>
      set((state) => ({
        ...state,
        modules: {
          ...state.modules,
          coach: { ...state.modules.coach, ...coachState },
        },
      })),

    // Reset
    reset: () => set(() => createDefaultState()),
  }),
  {
    name: 'ec-app-store',
    storage: createJSONStorage(() => localStorage),
    version: 1,
    migrate: (persistedState, _version) => {
      const defaults = createDefaultState();
      const state = (persistedState ?? {}) as Partial<AppState>;

      return {
        theme: state.theme ?? defaults.theme,
        preferences: {
          ...defaults.preferences,
          ...(state.preferences ?? {}),
        },
        modules: {
          music: {
            ...defaults.modules.music,
            ...(state.modules?.music ?? {}),
          },
          emotion: {
            ...defaults.modules.emotion,
            ...(state.modules?.emotion ?? {}),
          },
        },
      } as Partial<AppStore>;
    },
    partialize: (state) => ({
      theme: state.theme,
      preferences: state.preferences,
      modules: {
        music: state.modules.music,
        emotion: state.modules.emotion,
      },
    }),
  }
);

const enhancedStore = subscribeWithSelector(store);
const devtoolsEnabled = process.env.NODE_ENV !== 'production';

export const useAppStore = create<AppStore>()(
  devtoolsEnabled ? devtools(enhancedStore, { name: 'EC App Store' }) : enhancedStore
);

// Sélecteurs pour optimiser les re-renders
export const selectUser = (state: AppState) => state.user;
export const selectAuthState = (state: AppState) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
});
export const selectTheme = (state: AppState) => state.theme;
export const selectPreferences = (state: AppState) => state.preferences;
export const selectMusicModule = (state: AppState) => state.modules.music;
export const selectEmotionModule = (state: AppState) => state.modules.emotion;
export const selectJournalModule = (state: AppState) => state.modules.journal;
export const selectCoachModule = (state: AppState) => state.modules.coach;
export const selectUserRole = (state: AppState) => state.user?.role ?? null;
export const selectCacheEntry = (key: string) => (state: AppState) => state.cache[key];

export { shallow };
