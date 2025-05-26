
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'sans' | 'serif' | 'mono';

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
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}
