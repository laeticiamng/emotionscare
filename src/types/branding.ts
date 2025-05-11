
export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export interface BrandingContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  getContrastText: (color: string) => string;
  
  // Add missing properties
  visualDensity?: 'compact' | 'comfortable' | 'spacious';
  brandName?: string;
  soundEnabled?: boolean;
  primaryColor?: string;
  setThemePreference?: (theme: Theme) => void;
}

export interface BrandingOptions {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logo?: string;
  favicon?: string;
  fontFamily?: string;
}
