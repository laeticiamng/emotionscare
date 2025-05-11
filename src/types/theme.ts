
// Import des définitions de types depuis le ThemeContext principal
import { Theme, FontSize, FontFamily, ThemeContextType } from '@/contexts/ThemeContext';

// Re-export des types pour la compatibilité
export type ThemeName = Theme;

export interface ThemeSettings {
  name: ThemeName;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  animations?: boolean;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeProviderProps {
  theme?: ThemeName;
  children: React.ReactNode;
  defaultTheme?: ThemeName;
}

// Mettre à jour pour être compatible avec le ThemeContext principal
export type { ThemeContextType };
