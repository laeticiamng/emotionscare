
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

export interface FontSizeOption {
  value: FontSize;
  label: string;
}

export interface ThemeOption {
  value: ThemeName;
  label: string;
  description?: string;
}

export interface AudioPreference {
  volume: number;
  autoplay: boolean;
  equalizerEnabled: boolean;
  equalizerPresets: string[];
  selectedPreset: string;
  setVolume: (volume: number) => void;
  setAutoplay: (autoplay: boolean) => void;
  toggleEqualizer: () => void;
  setEqualizerPreset: (preset: string) => void;
}
