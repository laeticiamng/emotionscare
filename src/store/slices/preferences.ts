// @ts-nocheck
import type { StateCreator } from 'zustand';
import type { AppState } from '../appStore';

export interface PreferencesState {
  preferences: {
    language: 'fr' | 'en';
    notifications: boolean;
    autoSave: boolean;
    analyticsEnabled: boolean;
    [key: string]: unknown;
  };
}

export interface PreferencesActions {
  updatePreferences: (preferences: Record<string, unknown>) => void;
}

export type PreferencesSlice = PreferencesState & PreferencesActions;

export const createPreferencesInitialState = (): PreferencesState => ({
  preferences: {
    language: 'fr',
    notifications: true,
    autoSave: true,
    analyticsEnabled: true,
  },
});

export const createPreferencesSlice: StateCreator<AppState, [], [], PreferencesSlice> = (set, get) => ({
  ...createPreferencesInitialState(),
  updatePreferences: (preferences) =>
    set({
      preferences: { ...get().preferences, ...preferences },
    }),
});
