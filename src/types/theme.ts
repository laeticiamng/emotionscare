
export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ThemeName = 'light' | 'dark' | 'system';

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
}
