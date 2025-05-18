
import { UserPreferences } from './user';

export type FontFamily = 'inter' | 'roboto' | 'system' | 'open-sans' | 'poppins' | 'sans' | 'serif' | 'mono' | 'rounded' | 'monospace' | 'sans-serif' | string;

export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'medium' | string;

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel' | string;

export type Theme = ThemeName | 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeOption {
  name: string;
  value: Theme;
  icon?: string;
  description?: string;
  preview?: string;
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  colorAccent?: string;
  setColorAccent?: (colorAccent: string) => void;
  savePreferences?: (preferences: Partial<UserPreferences>) => Promise<void>;
  toggleTheme?: () => void;
  isDark?: boolean;
  isDarkMode?: boolean;
  systemTheme?: 'dark' | 'light';
  preferences?: {
    soundEnabled: boolean;
    reduceMotion: boolean;
  };
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  updatePreferences?: (prefs: { soundEnabled?: boolean; reduceMotion?: boolean }) => void;
  getContrastText?: (color: string) => 'black' | 'white';
}

export interface UserThemePreferences {
  theme: Theme;
  fontFamily: FontFamily;
  fontSize: FontSize;
  colorAccent?: string;
}
