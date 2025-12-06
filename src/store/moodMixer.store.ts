// @ts-nocheck
import { create } from 'zustand';

import { moodPresetsService, MoodPresetPayload } from '@/services/moodPresetsService';
import type { MoodPresetRecord } from '@/types/mood-mixer';

interface MoodMixerState {
  presets: MoodPresetRecord[];
  isLoading: boolean;
  isMutating: boolean;
  selectedPresetId: string | null;
  error: string | null;
  loadPresets: () => Promise<MoodPresetRecord[]>;
  selectPreset: (presetId: string | null) => void;
  createPreset: (payload: MoodPresetPayload) => Promise<MoodPresetRecord>;
  updatePreset: (id: string, payload: Partial<MoodPresetPayload>) => Promise<MoodPresetRecord>;
  deletePreset: (id: string) => Promise<void>;
  reset: () => void;
}

const defaultState: Omit<MoodMixerState, 'loadPresets' | 'selectPreset' | 'createPreset' | 'updatePreset' | 'deletePreset' | 'reset'> = {
  presets: [],
  isLoading: false,
  isMutating: false,
  selectedPresetId: null,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }
  return fallback;
};

export const useMoodMixerStore = create<MoodMixerState>((set) => ({
  ...defaultState,
  async loadPresets() {
    set({ isLoading: true, error: null });
    try {
      const presets = await moodPresetsService.listPresets();
      set((state) => ({
        presets,
        isLoading: false,
        selectedPresetId: presets.some((preset) => preset.id === state.selectedPresetId)
          ? state.selectedPresetId
          : null,
      }));
      return presets;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to load mood presets');
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  selectPreset(presetId) {
    set({ selectedPresetId: presetId });
  },
  async createPreset(payload) {
    set({ isMutating: true, error: null });
    try {
      const record = await moodPresetsService.createPreset(payload);
      if (!record) {
        throw new Error('Preset creation returned no record');
      }

      set((state) => ({
        presets: [record, ...state.presets],
        isMutating: false,
        selectedPresetId: record.id,
      }));

      return record;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to create mood preset');
      set({ isMutating: false, error: message });
      throw error;
    }
  },
  async updatePreset(id, payload) {
    set({ isMutating: true, error: null });
    try {
      const record = await moodPresetsService.updatePreset(id, payload);
      if (!record) {
        throw new Error('Preset update returned no record');
      }

      set((state) => ({
        presets: state.presets.map((preset) => (preset.id === id ? record : preset)),
        isMutating: false,
        selectedPresetId: record.id,
      }));

      return record;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to update mood preset');
      set({ isMutating: false, error: message });
      throw error;
    }
  },
  async deletePreset(id) {
    set({ isMutating: true, error: null });
    try {
      await moodPresetsService.deletePreset(id);
      set((state) => {
        const presets = state.presets.filter((preset) => preset.id !== id);
        const selectedPresetId = state.selectedPresetId === id ? null : state.selectedPresetId;
        return {
          presets,
          isMutating: false,
          selectedPresetId,
        };
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to delete mood preset');
      set({ isMutating: false, error: message });
      throw error;
    }
  },
  reset() {
    set({ ...defaultState });
  },
}));
