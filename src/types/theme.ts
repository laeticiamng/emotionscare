
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export type Theme = ThemeName;

export type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded' | 'system' | 'monospace' | 'sans-serif';

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'xlarge';

export interface ThemeOption {
  value: string;
  label: string;
  preview: string;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  preferences?: {
    reduceMotion?: boolean;
    highContrast?: boolean;
    soundEnabled?: boolean;
  };
  updatePreferences?: (prefs: any) => void;
  reduceMotion?: boolean;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  isDark?: boolean;
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  setReduceMotion?: (reduced: boolean) => void;
  systemTheme?: 'dark' | 'light';
  getContrastText?: (color: string) => 'black' | 'white';
}
