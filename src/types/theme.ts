
// Theme types
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'monospace';
export type FontSize = 'small' | 'medium' | 'large';

export interface ThemeSettings {
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  colorBlindMode: boolean;
}
