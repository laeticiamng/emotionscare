
export type Theme = 'light' | 'dark' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'serif' | 'mono' | 'sans';

export interface ThemeButtonProps {
  variant?: string;
  size?: string;
}
