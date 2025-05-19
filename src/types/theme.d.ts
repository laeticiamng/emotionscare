
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'system' | 'rounded';

export interface Theme {
  name: ThemeName;
  label: string;
  className: string;
  value?: string;
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
  soundEnabled?: boolean;
  reduceMotion: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  setReduceMotion: (reduced: boolean) => void;
  preferences?: any;
  updatePreferences?: (prefs: any) => void;
  getContrastText?: (color: string) => string;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
}
