
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
}

export interface ThemeButtonProps {
  className?: string;
  hasTopbarLabel?: boolean;
  variant?: "icon" | "outline" | "ghost";
}
