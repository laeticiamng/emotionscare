
export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'sans' | 'serif' | 'mono';

export interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
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

export interface ThemeOption {
  name: string;
  value: ThemeName;
  description?: string;
}
