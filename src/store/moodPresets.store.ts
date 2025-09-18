import { create } from 'zustand';
import { MoodPresetRecord } from '@/types/mood-mixer';
import { moodPresetsService, MoodPresetPayload } from '@/services/moodPresetsService';

interface MoodPresetsState {
  presets: MoodPresetRecord[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasInitialized: boolean;
  selectedPresetId: string | null;
  lastFetchedAt: number | null;
}

interface MoodPresetsActions {
  loadPresets: (options?: { force?: boolean }) => Promise<MoodPresetRecord[]>;
  selectPreset: (id: string | null) => void;
  createPreset: (payload: MoodPresetPayload) => Promise<MoodPresetRecord | null>;
  updatePreset: (id: string, payload: Partial<MoodPresetPayload>) => Promise<MoodPresetRecord | null>;
  deletePreset: (id: string) => Promise<boolean>;
  reset: () => void;
}

export type MoodPresetsStore = MoodPresetsState & MoodPresetsActions;

const initialState: MoodPresetsState = {
  presets: [],
  isLoading: false,
  isSaving: false,
  error: null,
  hasInitialized: false,
  selectedPresetId: null,
  lastFetchedAt: null,
};

const sortPresets = (presets: MoodPresetRecord[]) =>
  [...presets].sort((a, b) => {
    const left = Date.parse(a.updatedAt ?? a.createdAt ?? '');
    const right = Date.parse(b.updatedAt ?? b.createdAt ?? '');
    if (Number.isNaN(left) && Number.isNaN(right)) return 0;
    if (Number.isNaN(left)) return 1;
    if (Number.isNaN(right)) return -1;
    return right - left;
  });

const dedupePresets = (presets: MoodPresetRecord[]) => {
  const byId = new Map<string, MoodPresetRecord>();
  presets.forEach((preset) => {
    byId.set(preset.id, preset);
  });
  return [...byId.values()];
};

const normalizeError = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Une erreur inattendue est survenue.';
};

export const useMoodPresetsStore = create<MoodPresetsStore>((set, get) => ({
  ...initialState,

  async loadPresets({ force = false } = {}) {
    const { isLoading, hasInitialized, lastFetchedAt } = get();
    const stale = !lastFetchedAt || Date.now() - lastFetchedAt > 60_000;
    if (isLoading || (hasInitialized && !force && !stale)) {
      return get().presets;
    }

    set({ isLoading: true, error: null });

    try {
      const records = await moodPresetsService.listPresets();
      const presets = sortPresets(dedupePresets(records));
      const selectedPresetId = presets.some((preset) => preset.id === get().selectedPresetId)
        ? get().selectedPresetId
        : null;

      set({
        presets,
        isLoading: false,
        hasInitialized: true,
        selectedPresetId,
        lastFetchedAt: Date.now(),
        error: null,
      });

      return presets;
    } catch (error) {
      set({
        isLoading: false,
        hasInitialized: true,
        error: normalizeError(error),
      });
      throw error;
    }
  },

  selectPreset(id) {
    const { presets } = get();
    if (id && !presets.some((preset) => preset.id === id)) {
      return;
    }
    set({ selectedPresetId: id });
  },

  async createPreset(payload) {
    if (get().isSaving) {
      return null;
    }

    set({ isSaving: true, error: null });

    try {
      const record = await moodPresetsService.createPreset(payload);
      if (!record) {
        return null;
      }

      const presets = sortPresets([record, ...get().presets.filter((preset) => preset.id !== record.id)]);

      set({
        presets,
        isSaving: false,
        selectedPresetId: record.id,
        error: null,
      });

      return record;
    } catch (error) {
      set({ isSaving: false, error: normalizeError(error) });
      throw error;
    }
  },

  async updatePreset(id, payload) {
    if (get().isSaving) {
      return null;
    }

    set({ isSaving: true, error: null });

    try {
      const record = await moodPresetsService.updatePreset(id, payload);
      if (!record) {
        return null;
      }

      const presets = sortPresets([
        record,
        ...get().presets.filter((preset) => preset.id !== record.id),
      ]);

      set({
        presets,
        isSaving: false,
        selectedPresetId: record.id,
        error: null,
      });

      return record;
    } catch (error) {
      set({ isSaving: false, error: normalizeError(error) });
      throw error;
    }
  },

  async deletePreset(id) {
    if (get().isSaving) {
      return false;
    }

    set({ isSaving: true, error: null });

    try {
      await moodPresetsService.deletePreset(id);

      const presets = get().presets.filter((preset) => preset.id !== id);
      const selectedPresetId = get().selectedPresetId === id ? null : get().selectedPresetId;

      set({
        presets,
        isSaving: false,
        selectedPresetId,
        error: null,
      });

      return true;
    } catch (error) {
      set({ isSaving: false, error: normalizeError(error) });
      throw error;
    }
  },

  reset() {
    set({ ...initialState });
  },
}));
