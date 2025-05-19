
import { ReactNode } from 'react';
import { Theme } from './theme';

export interface LayoutContextType {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen?: (open: boolean) => void;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
  fullscreen?: boolean;
  setFullscreen?: (fullscreen: boolean) => void;
}

export interface LayoutProviderProps {
  children: ReactNode;
}

// Adding ShellProps interface
export interface ShellProps {
  children?: ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
  className?: string;
}
