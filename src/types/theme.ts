
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'inter' | 'sans-serif' | 'monospace';
export type ThemeName = Theme;

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme?: () => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
}

export interface ThemeOption {
  name: string;
  value: Theme;
  preview: string;
}

export interface ThemeSettingsTabProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}
