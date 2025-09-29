
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  systemTheme: ThemeName;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  preferences: Record<string, any>;
  updatePreferences: (prefs: Record<string, any>) => void;
  getContrastText: (color: string) => string;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}
