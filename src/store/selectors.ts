// @ts-nocheck
import type { AppState } from './appStore';

export const selectUser = (state: AppState) => state.user;
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;
export const selectIsLoading = (state: AppState) => state.isLoading;

export const selectAuthSlice = (state: AppState) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
});

export const selectTheme = (state: AppState) => state.theme;
export const selectSidebarCollapsed = (state: AppState) => state.sidebarCollapsed;
export const selectActiveModule = (state: AppState) => state.activeModule;

export const selectUIState = (state: AppState) => ({
  theme: state.theme,
  sidebarCollapsed: state.sidebarCollapsed,
  activeModule: state.activeModule,
});

export const selectPreferences = (state: AppState) => state.preferences;

export const selectModules = (state: AppState) => state.modules;
export const selectMusicModule = (state: AppState) => state.modules.music;
export const selectEmotionModule = (state: AppState) => state.modules.emotion;
export const selectJournalModule = (state: AppState) => state.modules.journal;
export const selectCoachModule = (state: AppState) => state.modules.coach;

export const selectCache = (state: AppState) => state.cache;
export const selectCacheTimestamps = (state: AppState) => state.cacheTimestamps;
export const selectCacheValue = (key: string) => (state: AppState) => state.cache[key];

export const selectSetUser = (state: AppState) => state.setUser;
export const selectSetTheme = (state: AppState) => state.setTheme;
export const selectToggleSidebar = (state: AppState) => state.toggleSidebar;
export const selectSetActiveModule = (state: AppState) => state.setActiveModule;
export const selectUpdatePreferences = (state: AppState) => state.updatePreferences;
export const selectUpdateMusicState = (state: AppState) => state.updateMusicState;
export const selectUpdateEmotionState = (state: AppState) => state.updateEmotionState;
export const selectUpdateJournalState = (state: AppState) => state.updateJournalState;
export const selectUpdateCoachState = (state: AppState) => state.updateCoachState;
export const selectSetCache = (state: AppState) => state.setCache;
export const selectGetCache = (state: AppState) => state.getCache;
export const selectClearCache = (state: AppState) => state.clearCache;
export const selectIsCacheValid = (state: AppState) => state.isCacheValid;
export const selectReset = (state: AppState) => state.reset;

export const selectGlobalState = (state: AppState) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  theme: state.theme,
  sidebarCollapsed: state.sidebarCollapsed,
  activeModule: state.activeModule,
  cache: state.cache,
  cacheTimestamps: state.cacheTimestamps,
  preferences: state.preferences,
  modules: state.modules,
});

export const selectStoreActions = (state: AppState) => ({
  setUser: state.setUser,
  setTheme: state.setTheme,
  setAuthenticated: state.setAuthenticated,
  setLoading: state.setLoading,
  toggleSidebar: state.toggleSidebar,
  setActiveModule: state.setActiveModule,
  updatePreferences: state.updatePreferences,
  updateMusicState: state.updateMusicState,
  updateEmotionState: state.updateEmotionState,
  updateJournalState: state.updateJournalState,
  updateCoachState: state.updateCoachState,
  setCache: state.setCache,
  getCache: state.getCache,
  clearCache: state.clearCache,
  isCacheValid: state.isCacheValid,
  reset: state.reset,
});
