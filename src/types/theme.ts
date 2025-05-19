
import { ThemeType } from './preferences';

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  systemTheme: ThemeType;
  soundEnabled?: boolean;
  reduceMotion?: boolean;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  defaultFontSize?: FontSize;
  forcedTheme?: ThemeType;
  storageKey?: string;
}
