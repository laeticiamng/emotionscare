
export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export interface BrandingOptions {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  fontFamily?: string;
  theme?: Theme;
  brandName?: string;
}

export interface BrandingContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  isPastelTheme?: boolean;
  getContrastText?: (color: string) => 'black' | 'white';
  primaryColor?: string;
  brandName?: string;
  soundEnabled?: boolean;
  visualDensity?: 'compact' | 'balanced' | 'spacious';
  brandingTheme?: string;
  emotionalTone?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
  };
  setThemePreference?: (theme: Theme) => void;
  applyEmotionalBranding?: (emotion: string) => void;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemePreference?: (theme: Theme) => void;
}
