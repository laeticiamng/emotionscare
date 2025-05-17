
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface Theme {
  name: string;
  value: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  themes: Record<ThemeName, Theme>;
  isDarkMode?: boolean;
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  reduceMotion?: boolean;
  setReduceMotion?: (reduced: boolean) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  getContrastText?: (color: string) => 'black' | 'white';
}

export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'monospace' | 'sans-serif';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export interface ThemeOption {
  name: string;
  value: ThemeName;
  preview: string;
}
