import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MoodPresetRecord } from '@/types/mood-mixer';
import { useMoodPresetsStore } from '@/store/moodPresets.store';
import { moodPresetsService } from '@/services/moodPresetsService';

vi.mock('@/services/moodPresetsService', () => ({
  moodPresetsService: {
    listPresets: vi.fn(),
    createPreset: vi.fn(),
    updatePreset: vi.fn(),
    deletePreset: vi.fn(),
  },
}));

const serviceMock = vi.mocked(moodPresetsService);

const samplePreset = (overrides: Partial<MoodPresetRecord> = {}): MoodPresetRecord => ({
  id: overrides.id ?? 'preset-1',
  slug: overrides.slug ?? null,
  userId: overrides.userId ?? 'user-1',
  name: overrides.name ?? 'Morning Boost',
  description: overrides.description ?? 'Réveil énergique',
  icon: overrides.icon ?? 'sun',
  gradient: overrides.gradient ?? 'from-orange-400 to-yellow-500',
  tags: overrides.tags ?? ['Matin'],
  softness: overrides.softness ?? 65,
  clarity: overrides.clarity ?? 40,
  blend: overrides.blend ?? { joy: 0.8, calm: 0.2, energy: 0.7, focus: 0.5 },
  createdAt: overrides.createdAt ?? '2024-06-01T08:00:00.000Z',
  updatedAt: overrides.updatedAt ?? '2024-06-01T08:00:00.000Z',
});

describe('useMoodPresetsStore', () => {
  beforeEach(() => {
    useMoodPresetsStore.getState().reset();
    vi.clearAllMocks();
  });

  it('loads presets only once unless forced', async () => {
    serviceMock.listPresets.mockResolvedValue([
      samplePreset({ id: 'preset-1' }),
      samplePreset({ id: 'preset-2', name: 'Focus Deep', createdAt: '2024-05-01T12:00:00.000Z' }),
    ]);

    const { loadPresets } = useMoodPresetsStore.getState();

    const firstLoad = await loadPresets();
    expect(firstLoad).toHaveLength(2);
    expect(serviceMock.listPresets).toHaveBeenCalledTimes(1);

    const secondLoad = await loadPresets();
    expect(secondLoad).toHaveLength(2);
    expect(serviceMock.listPresets).toHaveBeenCalledTimes(1);

    await loadPresets({ force: true });
    expect(serviceMock.listPresets).toHaveBeenCalledTimes(2);
  });

  it('deduplicates presets by id on load', async () => {
    serviceMock.listPresets.mockResolvedValue([
      samplePreset({ id: 'preset-1', updatedAt: '2024-06-02T10:00:00.000Z' }),
      samplePreset({ id: 'preset-1', name: 'Duplicate', updatedAt: '2024-06-01T10:00:00.000Z' }),
      samplePreset({ id: 'preset-2', name: 'Second Preset' }),
    ]);

    const { loadPresets } = useMoodPresetsStore.getState();
    const presets = await loadPresets({ force: true });

    expect(presets).toHaveLength(2);
    expect(useMoodPresetsStore.getState().presets).toHaveLength(2);
    expect(presets.some((preset) => preset.id === 'preset-1')).toBe(true);
    expect(presets.some((preset) => preset.id === 'preset-2')).toBe(true);
  });

  it('creates a preset and selects it', async () => {
    const created = samplePreset({ id: 'preset-created', name: 'Creative Flow' });
    serviceMock.createPreset.mockResolvedValueOnce(created);

    const { createPreset } = useMoodPresetsStore.getState();

    const result = await createPreset({
      name: created.name,
      description: created.description,
      blend: created.blend,
      softness: created.softness,
      clarity: created.clarity,
      userId: created.userId,
    });

    expect(result).toEqual(created);
    const state = useMoodPresetsStore.getState();
    expect(state.presets[0]).toEqual(created);
    expect(state.selectedPresetId).toBe('preset-created');
    expect(state.isSaving).toBe(false);
  });

  it('updates an existing preset in place', async () => {
    useMoodPresetsStore.setState({
      presets: [samplePreset({ id: 'preset-1' })],
      hasInitialized: true,
    });

    const updated = samplePreset({ id: 'preset-1', name: 'Sunrise Boost', softness: 72 });
    serviceMock.updatePreset.mockResolvedValueOnce(updated);

    const { updatePreset } = useMoodPresetsStore.getState();
    const result = await updatePreset('preset-1', { name: 'Sunrise Boost', softness: 72 });

    expect(result).toEqual(updated);
    const state = useMoodPresetsStore.getState();
    expect(state.presets).toHaveLength(1);
    expect(state.presets[0].name).toBe('Sunrise Boost');
    expect(state.presets[0].softness).toBe(72);
    expect(state.selectedPresetId).toBe('preset-1');
  });

  it('removes a preset and clears selection when deleting the active one', async () => {
    useMoodPresetsStore.setState({
      presets: [
        samplePreset({ id: 'preset-1', name: 'Morning' }),
        samplePreset({ id: 'preset-2', name: 'Night' }),
      ],
      selectedPresetId: 'preset-2',
    });

    serviceMock.deletePreset.mockResolvedValueOnce(true);

    const { deletePreset } = useMoodPresetsStore.getState();
    const success = await deletePreset('preset-2');

    expect(success).toBe(true);
    const state = useMoodPresetsStore.getState();
    expect(state.presets).toHaveLength(1);
    expect(state.presets[0].id).toBe('preset-1');
    expect(state.selectedPresetId).toBeNull();
  });

  it('exposes error messages when operations fail', async () => {
    serviceMock.listPresets.mockRejectedValueOnce(new Error('Network down'));

    const { loadPresets } = useMoodPresetsStore.getState();
    await expect(loadPresets()).rejects.toThrow('Network down');

    const stateAfterLoad = useMoodPresetsStore.getState();
    expect(stateAfterLoad.error).toBe('Network down');

    serviceMock.createPreset.mockRejectedValueOnce('Insert failed');
    const { createPreset } = useMoodPresetsStore.getState();
    await expect(createPreset({ name: 'Test', blend: { joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 } })).rejects.toThrow('Insert failed');
    expect(useMoodPresetsStore.getState().error).toBe('Insert failed');
  });
});
