
import { ThemeType } from './preferences';

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'system' | 'rounded' | 'monospace' | 'sans-serif';
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = Theme;
export type ThemeOption = Theme;

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  systemTheme: ThemeType;
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  preferences?: any; // For Shell.tsx and AudioControls.tsx
  isDarkMode?: boolean; // For ThemeButton.tsx
  isDark?: boolean;
  toggleTheme?: () => void; // For theme-provider.tsx
  fontFamily?: FontFamily;
  setFontFamily?: (fontFamily: FontFamily) => void;
  getContrastText?: (color: string) => 'black' | 'white';
  updatePreferences?: (preferences: any) => Promise<void>;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  defaultFontSize?: FontSize;
  forcedTheme?: ThemeType;
  storageKey?: string;
}
