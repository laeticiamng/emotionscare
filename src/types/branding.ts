// @ts-nocheck

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type VisualDensity = 'compact' | 'balanced' | 'spacious' | 'comfortable';

export interface BrandingOptions {
  primaryColor: string;
  brandName: string;
  theme?: Theme;
  soundEnabled?: boolean;
  visualDensity?: VisualDensity;
  logo?: string;
}

export interface BrandingContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  getContrastText: (color: string) => 'black' | 'white';
  primaryColor: string;
  brandName: string;
  soundEnabled?: boolean;
  visualDensity?: VisualDensity;
  setThemePreference?: (theme: Theme) => void;
  logoUrl: string;
  companyName: string;
  applyEmotionalBranding?: (emotion: string) => void;
}
