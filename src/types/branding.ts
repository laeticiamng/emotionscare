
export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export interface BrandingContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  getContrastText: (color: string) => string;
  
  // Add missing properties
  visualDensity: 'compact' | 'comfortable' | 'spacious';
  brandName: string;
  soundEnabled: boolean;
  setThemePreference?: (theme: Theme) => void;
}
