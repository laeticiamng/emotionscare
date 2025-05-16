
export type Theme = 'light' | 'dark' | 'system' | 'blue-pastel' | 'pastel';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface ThemeSettingsTabProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}
