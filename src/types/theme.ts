
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ElementType;
}

export type FontFamily = 'inter' | 'system' | 'mono';
export type FontSize = 'sm' | 'base' | 'lg';
export type ThemeName = 'blue' | 'green' | 'purple' | 'orange';
