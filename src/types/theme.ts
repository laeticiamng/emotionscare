
import { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export type FontSize = 
  | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'extra-large'
  | 'sm' | 'md' | 'lg' | 'xl';

export type FontFamily = 
  | 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded'
  | 'sans' | 'mono' | 'inter' | 'system-ui' | 'default';

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isDarkMode: boolean;
  getContrastText?: (color: string) => 'black' | 'white';
  isSidebarOpen?: boolean;
  collapsed?: boolean;
  expanded?: boolean;
  toggleCollapsed?: () => void;
}

export interface ThemeButtonProps {
  variant?: 'icon' | 'text' | 'both';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default';
  onClick?: () => void;
  collapsed?: boolean;
}

export interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'button' | 'toggle';
  position?: 'navbar' | 'sidebar' | 'footer';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
}

// Re-exported for compatibility with SidebarContext
export interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  expanded: boolean;
  collapsed: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
  toggleCollapsed: () => void;
}
