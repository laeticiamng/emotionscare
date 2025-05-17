
import { ThemeName, FontSize, FontFamily } from './preferences';

export type Theme = ThemeName;

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
}

export { ThemeName, FontSize, FontFamily };

export interface ThemeSettingsTabProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export interface ThemeOption {
  name: string;
  value: Theme;
  preview: string;
}
