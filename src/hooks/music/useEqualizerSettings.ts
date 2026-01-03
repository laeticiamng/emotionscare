/**
 * useEqualizerSettings - Persistance des réglages d'égaliseur
 */

import { useMusicSettings } from './useMusicSettings';

export interface EqualizerPreset {
  name: string;
  bands: number[];
}

export interface EqualizerSettings {
  enabled: boolean;
  currentPreset: string;
  customBands: number[];
  presets: EqualizerPreset[];
}

const DEFAULT_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', bands: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Treble Boost', bands: [0, 0, 0, 0, 0, 2, 4, 5, 6, 6] },
  { name: 'Vocal', bands: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2] },
  { name: 'Rock', bands: [5, 4, 3, 1, -1, -1, 1, 3, 4, 5] },
  { name: 'Jazz', bands: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3] },
  { name: 'Electronic', bands: [5, 4, 1, 0, -2, -2, 0, 2, 4, 5] },
  { name: 'Relaxation', bands: [-2, 0, 2, 3, 2, 1, 0, 1, 2, 1] },
  { name: 'Thérapeutique', bands: [0, 1, 2, 3, 2, 2, 1, 1, 0, -1] },
];

const DEFAULT_SETTINGS: EqualizerSettings = {
  enabled: false,
  currentPreset: 'Flat',
  customBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  presets: DEFAULT_PRESETS,
};

export function useEqualizerSettings() {
  const { value, setValue, isLoading, isSynced, saveNow } = useMusicSettings<EqualizerSettings>({
    key: 'music:equalizer-settings' as any,
    defaultValue: DEFAULT_SETTINGS,
    debounceMs: 300,
  });

  const setEnabled = (enabled: boolean) => {
    setValue(prev => ({ ...prev, enabled }));
  };

  const setPreset = (presetName: string) => {
    const preset = value.presets.find(p => p.name === presetName);
    if (preset) {
      setValue(prev => ({
        ...prev,
        currentPreset: presetName,
        customBands: [...preset.bands],
      }));
    }
  };

  const setBand = (index: number, gain: number) => {
    setValue(prev => {
      const newBands = [...prev.customBands];
      newBands[index] = Math.max(-12, Math.min(12, gain));
      return {
        ...prev,
        customBands: newBands,
        currentPreset: 'Custom',
      };
    });
  };

  const saveCustomPreset = (name: string) => {
    setValue(prev => ({
      ...prev,
      presets: [
        ...prev.presets.filter(p => p.name !== name),
        { name, bands: [...prev.customBands] },
      ],
      currentPreset: name,
    }));
  };

  const deletePreset = (name: string) => {
    if (DEFAULT_PRESETS.some(p => p.name === name)) return; // Don't delete defaults
    setValue(prev => ({
      ...prev,
      presets: prev.presets.filter(p => p.name !== name),
      currentPreset: prev.currentPreset === name ? 'Flat' : prev.currentPreset,
    }));
  };

  const resetToDefault = () => {
    setValue(DEFAULT_SETTINGS);
  };

  return {
    settings: value,
    isLoading,
    isSynced,
    setEnabled,
    setPreset,
    setBand,
    saveCustomPreset,
    deletePreset,
    resetToDefault,
    saveNow,
    presets: value.presets,
    currentBands: value.customBands,
    isEnabled: value.enabled,
  };
}

export default useEqualizerSettings;
