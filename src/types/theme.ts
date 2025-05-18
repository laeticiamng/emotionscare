
export type Theme = 'system' | 'light' | 'dark' | 'pastel';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'monospace' | 'sans-serif';
export type ThemeName = 'system' | 'light' | 'dark' | 'pastel';

export interface ThemeOption {
  name: string;
  value: ThemeName;
  preview: string;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isDarkMode?: boolean;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  systemTheme?: 'light' | 'dark';
  preferences?: {
    soundEnabled: boolean;
    reduceMotion: boolean;
  };
  updatePreferences?: (prefs: { soundEnabled?: boolean; reduceMotion?: boolean }) => void;
  getContrastText?: (color: string) => 'black' | 'white';
}
