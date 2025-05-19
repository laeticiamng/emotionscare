
export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark?: boolean;
  isDarkMode?: boolean;
  systemTheme?: 'dark' | 'light';
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  preferences?: {
    soundEnabled?: boolean;
    reduceMotion?: boolean;
    [key: string]: any;
  };
  updatePreferences?: (prefs: { soundEnabled?: boolean; reduceMotion?: boolean, [key: string]: any }) => void;
  getContrastText?: (color: string) => 'black' | 'white';
}

export type FontFamily = 
  | 'inter' 
  | 'manrope' 
  | 'system' 
  | 'sans' 
  | 'serif' 
  | 'mono' 
  | 'rounded'
  | 'monospace'
  | 'sans-serif';

export type FontSize = 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl'
  | 'xs'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';

export interface ThemeOption {
  value: Theme;
  label: string;
  preview: string;
}
