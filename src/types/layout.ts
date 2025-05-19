
import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  withSidebar?: boolean;
  withNavbar?: boolean;
  withFooter?: boolean;
  className?: string;
}

export interface ShellProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
}

export interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar?: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
}

export interface LayoutProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
  initialSidebarState?: boolean;
}
