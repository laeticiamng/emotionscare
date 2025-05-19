
export type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded' | 'system';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'xlarge';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface Theme {
  name: ThemeName;
  label: string;
  className: string;
  value?: string;
}

export interface ThemeOption {
  name: string;
  value: string;
  label: string;
  icon?: React.ReactNode;
}

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
  preferences?: any;
  updatePreferences?: (prefs: any) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  getContrastText?: (color: string) => string;
}
