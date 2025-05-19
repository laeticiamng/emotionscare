
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'inter' | 'roboto';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  systemTheme: 'light' | 'dark';
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  setReduceMotion?: (reduced: boolean) => void;
}
