
import { ThemeName, FontSize, FontFamily } from './preferences';

export type Theme = ThemeName;

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}
