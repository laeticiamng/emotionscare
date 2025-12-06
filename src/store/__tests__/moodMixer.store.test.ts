// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMoodMixerStore } from '../moodMixer.store';
import { moodPresetsService } from '@/services/moodPresetsService';
import type { MoodPresetPayload } from '@/services/moodPresetsService';
import type { MoodPresetRecord } from '@/types/mood-mixer';

vi.mock('@/services/moodPresetsService', () => ({
  moodPresetsService: {
    listPresets: vi.fn(),
    createPreset: vi.fn(),
    updatePreset: vi.fn(),
    deletePreset: vi.fn(),
  },
}));

const buildPreset = (overrides: Partial<MoodPresetRecord> = {}): MoodPresetRecord => ({
  id: 'preset-1',
  slug: null,
  userId: 'user-1',
  name: 'Preset 1',
  description: 'Mix personnel 50% doux, 50% clair',
  icon: null,
  gradient: null,
  tags: [],
  softness: 50,
  clarity: 50,
  blend: { joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 },
  createdAt: '2025-07-01T12:00:00.000Z',
  updatedAt: '2025-07-01T12:00:00.000Z',
  ...overrides,
});

const basePayload: MoodPresetPayload = {
  name: 'New vibe',
  description: 'Mix personnel 60% doux, 40% clair',
  blend: { joy: 0.6, calm: 0.4, energy: 0.4, focus: 0.6 },
  softness: 60,
  clarity: 40,
  tags: ['focus'],
  userId: 'user-1',
};

describe('useMoodMixerStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMoodMixerStore.getState().reset();
  });

  it('loads presets and updates selection if necessary', async () => {
    const presetA = buildPreset({ id: 'preset-a' });
    const presetB = buildPreset({ id: 'preset-b', name: 'Preset B' });

    vi.mocked(moodPresetsService.listPresets).mockResolvedValue([presetA, presetB]);

    const result = await useMoodMixerStore.getState().loadPresets();

    expect(result).toEqual([presetA, presetB]);
    const state = useMoodMixerStore.getState();
    expect(state.presets).toEqual([presetA, presetB]);
    expect(state.isLoading).toBe(false);
    expect(state.selectedPresetId).toBeNull();
  });

  it('exposes load errors and clears the loading flag', async () => {
    const failure = new Error('Network down');
    vi.mocked(moodPresetsService.listPresets).mockRejectedValue(failure);

    await expect(useMoodMixerStore.getState().loadPresets()).rejects.toThrow('Network down');

    const state = useMoodMixerStore.getState();
    expect(state.error).toBe('Network down');
    expect(state.isLoading).toBe(false);
  });

  it('creates a preset and selects it', async () => {
    const created = buildPreset({ id: 'preset-created', name: 'Created preset' });
    vi.mocked(moodPresetsService.createPreset).mockResolvedValue(created);

    const result = await useMoodMixerStore.getState().createPreset(basePayload);

    expect(moodPresetsService.createPreset).toHaveBeenCalledWith(basePayload);
    expect(result).toEqual(created);

    const state = useMoodMixerStore.getState();
    expect(state.presets[0]).toEqual(created);
    expect(state.selectedPresetId).toBe('preset-created');
    expect(state.isMutating).toBe(false);
  });

  it('propagates create errors and clears the mutating flag', async () => {
    vi.mocked(moodPresetsService.createPreset).mockRejectedValue(new Error('Insert failed'));

    await expect(useMoodMixerStore.getState().createPreset(basePayload)).rejects.toThrow('Insert failed');

    const state = useMoodMixerStore.getState();
    expect(state.error).toBe('Insert failed');
    expect(state.isMutating).toBe(false);
    expect(state.presets).toHaveLength(0);
  });

  it('updates a preset in place and keeps it selected', async () => {
    const initial = buildPreset({ id: 'preset-update', name: 'Initial name' });
    useMoodMixerStore.setState({
      presets: [initial],
      selectedPresetId: 'preset-update',
      isLoading: false,
      isMutating: false,
      error: null,
    });

    const updated = buildPreset({ id: 'preset-update', name: 'Updated name', clarity: 75 });
    vi.mocked(moodPresetsService.updatePreset).mockResolvedValue(updated);

    const result = await useMoodMixerStore.getState().updatePreset('preset-update', { name: 'Updated name' });

    expect(moodPresetsService.updatePreset).toHaveBeenCalledWith('preset-update', { name: 'Updated name' });
    expect(result).toEqual(updated);

    const state = useMoodMixerStore.getState();
    expect(state.presets[0]).toEqual(updated);
    expect(state.selectedPresetId).toBe('preset-update');
    expect(state.isMutating).toBe(false);
  });

  it('removes a preset and resets the selection if needed', async () => {
    const presetA = buildPreset({ id: 'preset-a' });
    const presetB = buildPreset({ id: 'preset-b' });
    useMoodMixerStore.setState({
      presets: [presetA, presetB],
      selectedPresetId: 'preset-a',
      isLoading: false,
      isMutating: false,
      error: null,
    });

    vi.mocked(moodPresetsService.deletePreset).mockResolvedValue(true);

    await useMoodMixerStore.getState().deletePreset('preset-a');

    const state = useMoodMixerStore.getState();
    expect(state.presets).toEqual([presetB]);
    expect(state.selectedPresetId).toBeNull();
    expect(state.isMutating).toBe(false);
  });

  it('restores the mutating flag if deletion fails', async () => {
    useMoodMixerStore.setState({
      presets: [buildPreset()],
      selectedPresetId: 'preset-1',
      isLoading: false,
      isMutating: false,
      error: null,
    });

    vi.mocked(moodPresetsService.deletePreset).mockRejectedValue(new Error('Deletion refused'));

    await expect(useMoodMixerStore.getState().deletePreset('preset-1')).rejects.toThrow('Deletion refused');

    const state = useMoodMixerStore.getState();
    expect(state.isMutating).toBe(false);
    expect(state.error).toBe('Deletion refused');
    expect(state.presets).toHaveLength(1);
  });
});
