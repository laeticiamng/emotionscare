
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeSettings {
  name: ThemeName;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  fontSize?: 'small' | 'medium' | 'large';
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

export interface ThemeContextProps {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  setThemePreference?: (theme: ThemeName) => void;
  systemTheme?: ThemeName;
  fontFamily?: string;
  setFontFamily?: (font: string) => void;
  fontSize?: string;
  setFontSize?: (size: string) => void;
}
