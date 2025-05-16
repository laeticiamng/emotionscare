
import { ThemeName, FontSize, FontFamily } from './preferences';

export type Theme = ThemeName;

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Re-export these types to avoid errors in ThemeSettingsTab
export { ThemeName, FontSize, FontFamily };

// Define a theme option type for use in UI components
export interface ThemeOption {
  name: string;
  value: string;
  preview: string;
}
