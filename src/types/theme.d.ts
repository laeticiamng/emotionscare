
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'inter';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  toggleTheme: () => void;
  getContrastText: (color: string) => 'black' | 'white';
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}
