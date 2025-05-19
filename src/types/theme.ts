
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'medium' | 'large';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  isDark?: boolean;
  toggleTheme: () => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  systemTheme?: 'light' | 'dark';
  preferences?: any;
  updatePreferences?: (newPrefs: any) => void;
  getContrastText?: (color: string) => string;
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
}
