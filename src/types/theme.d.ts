
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize =
  | 'xs'
  | 'sm'
  | 'small'
  | 'medium'
  | 'md'
  | 'lg'
  | 'large'
  | 'xl'
  | 'xlarge';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded';

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
  setReduceMotion: (reduced: boolean) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}
