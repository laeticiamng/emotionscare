
import { Theme } from './theme';

export interface LayoutContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
}

export interface LayoutProviderProps {
  children: React.ReactNode;
}

export interface ShellProps {
  children?: React.ReactNode;
}

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  premium?: boolean;
  disabled?: boolean;
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
}
