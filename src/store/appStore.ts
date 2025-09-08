import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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
  cache: Record<string, any>;
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
      currentTrack: any | null;
      isPlaying: boolean;
      volume: number;
      playlist: any[];
    };
    emotion: {
      currentMood: string | null;
      lastScan: any | null;
      history: any[];
    };
    journal: {
      entries: any[];
      currentEntry: any | null;
      unsavedChanges: boolean;
    };
    coach: {
      conversations: any[];
      activeConversation: string | null;
      suggestions: any[];
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
  setCache: (key: string, value: any) => void;
  getCache: (key: string) => any;
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

// Configuration par défaut
const defaultState: AppState = {
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
};

// Store principal avec persistance
export const useAppStore = create<AppStore>()(
  persist(
    immer((set, get) => ({
      ...defaultState,
      
      // Authentification Actions
      setUser: (user) => set((state) => {
        state.user = user;
      }),
      
      setAuthenticated: (isAuthenticated) => set((state) => {
        state.isAuthenticated = isAuthenticated;
      }),
      
      setLoading: (isLoading) => set((state) => {
        state.isLoading = isLoading;
      }),
      
      // UI Actions
      setTheme: (theme) => set((state) => {
        state.theme = theme;
      }),
      
      toggleSidebar: () => set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
      }),
      
      setActiveModule: (module) => set((state) => {
        state.activeModule = module;
      }),
      
      // Cache Actions
      setCache: (key, value) => set((state) => {
        state.cache[key] = value;
        state.cacheTimestamps[key] = Date.now();
      }),
      
      getCache: (key) => {
        const state = get();
        return state.cache[key];
      },
      
      clearCache: (key) => set((state) => {
        if (key) {
          delete state.cache[key];
          delete state.cacheTimestamps[key];
        } else {
          state.cache = {};
          state.cacheTimestamps = {};
        }
      }),
      
      isCacheValid: (key, maxAge = 5 * 60 * 1000) => { // 5 minutes par défaut
        const state = get();
        const timestamp = state.cacheTimestamps[key];
        if (!timestamp) return false;
        return Date.now() - timestamp < maxAge;
      },
      
      // Préférences
      updatePreferences: (preferences) => set((state) => {
        Object.assign(state.preferences, preferences);
      }),
      
      // Modules Actions
      updateMusicState: (musicState) => set((state) => {
        Object.assign(state.modules.music, musicState);
      }),
      
      updateEmotionState: (emotionState) => set((state) => {
        Object.assign(state.modules.emotion, emotionState);
      }),
      
      updateJournalState: (journalState) => set((state) => {
        Object.assign(state.modules.journal, journalState);
      }),
      
      updateCoachState: (coachState) => set((state) => {
        Object.assign(state.modules.coach, coachState);
      }),
      
      // Reset
      reset: () => set(() => ({ ...defaultState })),
    })),
    {
      name: 'emotionscare-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        preferences: state.preferences,
        // Ne pas persister l'état d'authentification et les données sensibles
      }),
    }
  )
);

// Sélecteurs pour optimiser les re-renders
export const useUser = () => useAppStore((state) => state.user);
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
}));
export const useTheme = () => useAppStore((state) => state.theme);
export const usePreferences = () => useAppStore((state) => state.preferences);
export const useMusicModule = () => useAppStore((state) => state.modules.music);
export const useEmotionModule = () => useAppStore((state) => state.modules.emotion);
export const useJournalModule = () => useAppStore((state) => state.modules.journal);
export const useCoachModule = () => useAppStore((state) => state.modules.coach);