import type { StateCreator } from 'zustand';
import type { AppState } from '../appStore';

export interface CacheState {
  cache: Record<string, unknown>;
  cacheTimestamps: Record<string, number>;
}

export interface CacheActions {
  setCache: (key: string, value: unknown) => void;
  getCache: (key: string) => unknown | undefined;
  clearCache: (key?: string) => void;
  isCacheValid: (key: string, maxAge?: number) => boolean;
}

export type CacheSlice = CacheState & CacheActions;

export const createCacheInitialState = (): CacheState => ({
  cache: {},
  cacheTimestamps: {},
});

export const createCacheSlice: StateCreator<AppState, [], [], CacheSlice> = (set, get) => ({
  ...createCacheInitialState(),
  setCache: (key, value) =>
    set((state) => ({
      cache: { ...state.cache, [key]: value },
      cacheTimestamps: { ...state.cacheTimestamps, [key]: Date.now() },
    })),
  getCache: (key) => get().cache[key],
  clearCache: (key) => {
    if (!key) {
      set(() => createCacheInitialState());
      return;
    }

    set((state) => {
      const { [key]: _removedValue, ...restCache } = state.cache;
      const { [key]: _removedTimestamp, ...restTimestamps } = state.cacheTimestamps;

      return {
        cache: restCache,
        cacheTimestamps: restTimestamps,
      };
    });
  },
  isCacheValid: (key, maxAge = 5 * 60 * 1000) => {
    const timestamp = get().cacheTimestamps[key];
    return typeof timestamp === 'number' && Date.now() - timestamp < maxAge;
  },
});
