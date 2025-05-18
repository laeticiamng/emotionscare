
import { UserPreferences } from './user';

export type FontFamily = 'inter' | 'roboto' | 'system' | 'open-sans' | 'poppins' | string;

export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | string;

export type ThemeName = 'light' | 'dark' | 'system' | 'custom' | string;

export interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  font: {
    family: FontFamily;
    size: FontSize;
  };
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  colorAccent: string;
  setColorAccent: (colorAccent: string) => void;
  savePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}
