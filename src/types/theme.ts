
export type Theme = 'system' | 'light' | 'dark' | 'pastel';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded';
export type ThemeName = 'system' | 'light' | 'dark' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}
