
export interface LayoutContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
}

export interface LayoutProviderProps {
  children: React.ReactNode;
}
