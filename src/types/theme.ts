
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = Theme;
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'monospace' | 'sans-serif';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode?: boolean;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  toggleTheme?: () => void;
  getContrastText?: (color: string) => 'black' | 'white';
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  systemTheme?: 'dark' | 'light';
  preferences?: any;
  updatePreferences?: (preferences: any) => void;
}

export interface ThemeSettingsTabProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export interface ThemeOption {
  name: string;
  value: Theme;
  preview: string;
}
