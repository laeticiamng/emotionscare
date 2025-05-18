
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'monospace' | 'sans-serif';
export type FontSize = 'small' | 'medium' | 'large' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
  systemTheme?: 'dark' | 'light';
  preferences?: {
    soundEnabled: boolean;
    reduceMotion: boolean;
  };
  updatePreferences?: (prefs: { soundEnabled?: boolean; reduceMotion?: boolean }) => void;
  soundEnabled?: boolean;
  reduceMotion?: boolean;
}

export interface ThemeOption {
  value: Theme;
  label: string;
  icon?: React.ReactNode;
}
