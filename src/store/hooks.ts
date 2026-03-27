// @ts-nocheck
'use client';

import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from './appStore';
import {
  selectAuthSlice,
  selectCacheValue,
  selectGlobalState,
  selectMusicModule,
  selectPreferences,
  selectSetUser,
  selectStoreActions,
  selectTheme,
  selectUIState,
  selectUser,
} from './selectors';

export const useUser = () => useAppStore(selectUser);
export const useThemeValue = () => useAppStore(selectTheme);

export const useAuthState = () => useAppStore(useShallow(selectAuthSlice));
export const useUIState = () => useAppStore(useShallow(selectUIState));
export const useMusicState = () => useAppStore(useShallow(selectMusicModule));
export const usePreferences = () => useAppStore(selectPreferences);
export const useGlobalStateSlice = () => useAppStore(useShallow(selectGlobalState));
export const useStoreActions = () => useAppStore(useShallow(selectStoreActions));
export const useSetUser = () => useAppStore(selectSetUser);

export const useCachedValue = <T = unknown>(key: string) =>
  useAppStore((state) => selectCacheValue(key)(state) as T);
