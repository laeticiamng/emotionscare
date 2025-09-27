'use client';

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

import {
  createAuthInitialState,
  createAuthSlice,
  type AuthSlice,
  type User,
  type UserProfile,
} from './slices/auth';
import {
  createUIInitialState,
  createUISlice,
  type ModuleKey,
  type Theme,
  type UISlice,
} from './slices/ui';
import {
  createCacheInitialState,
  createCacheSlice,
  type CacheSlice,
} from './slices/cache';
import {
  createPreferencesInitialState,
  createPreferencesSlice,
  type PreferencesSlice,
} from './slices/preferences';
import {
  createModulesInitialState,
  createModulesSlice,
  type ModulesSlice,
} from './slices/modules';

export type { User, UserProfile, Theme, ModuleKey };

export type AppState = AuthSlice &
  UISlice &
  CacheSlice &
  PreferencesSlice &
  ModulesSlice & {
    reset: () => void;
  };

const createInitialState = () => ({
  ...createAuthInitialState(),
  ...createUIInitialState(),
  ...createCacheInitialState(),
  ...createPreferencesInitialState(),
  ...createModulesInitialState(),
});

export const PERSIST_VERSION = 3;

export const partialize = (state: AppState) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  theme: state.theme,
  preferences: state.preferences,
  modules: {
    music: state.modules.music,
  },
});

type PersistedStateShape =
  | Record<string, unknown>
  | { state: Record<string, unknown>; version?: number };

export const migrate = (persistedState: unknown, fromVersion: number): PersistedStateShape | unknown => {
  if (persistedState == null || typeof persistedState !== 'object') {
    return persistedState;
  }

  if (fromVersion >= PERSIST_VERSION) {
    return persistedState;
  }

  const base = createInitialState();
  const next = Array.isArray(persistedState)
    ? [...persistedState]
    : { ...(persistedState as Record<string, unknown>) };

  const mergePreferences = (partial: unknown) => ({
    ...base.preferences,
    ...(typeof partial === 'object' && partial !== null ? (partial as Record<string, unknown>) : {}),
  });

  const mergeMusic = (partial: unknown) => ({
    ...base.modules.music,
    ...(typeof partial === 'object' && partial !== null ? (partial as Record<string, unknown>) : {}),
  });

  if ('state' in (next as Record<string, unknown>)) {
    const current = { ...((next as { state?: Record<string, unknown> }).state ?? {}) };
    const musicState = (current.modules as { music?: unknown })?.music;
    return {
      ...(next as Record<string, unknown>),
      state: {
        ...base,
        ...current,
        preferences: mergePreferences(current.preferences),
        modules: {
          ...base.modules,
          ...(typeof current.modules === 'object' && current.modules !== null
            ? (current.modules as Record<string, unknown>)
            : {}),
          music: mergeMusic(musicState),
        },
        cache: {},
        cacheTimestamps: {},
      },
    };
  }

  const musicState = (next as { modules?: { music?: unknown } }).modules?.music;

  return {
    ...base,
    ...(next as Record<string, unknown>),
    preferences: mergePreferences((next as { preferences?: unknown }).preferences),
    modules: {
      ...base.modules,
      ...(typeof (next as { modules?: unknown }).modules === 'object' &&
      (next as { modules?: Record<string, unknown> }).modules !== null
        ? ((next as { modules?: Record<string, unknown> }).modules as Record<string, unknown>)
        : {}),
      music: mergeMusic(musicState),
    },
    cache: {},
    cacheTimestamps: {},
  };
};

const persistConfig = {
  name: 'ec.app.v3',
  version: PERSIST_VERSION,
  storage: createJSONStorage(() => localStorage),
  partialize,
  migrate,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createAuthSlice(set, get, api),
        ...createUISlice(set, get, api),
        ...createCacheSlice(set, get, api),
        ...createPreferencesSlice(set, get, api),
        ...createModulesSlice(set, get, api),
        reset: () => set(() => createInitialState()),
      }),
      persistConfig
    ),
    { name: 'AppStore' }
  )
);

Object.defineProperty(useAppStore, 'persist', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: {
    getOptions: () => persistConfig,
  },
});
