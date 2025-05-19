
export interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  showHeader: boolean;
  setShowHeader: (show: boolean) => void;
  fullscreen: boolean;
  setFullscreen: (full: boolean) => void;
  contentWidth: string;
  setContentWidth: (width: string) => void;
}

export interface LayoutProviderProps {
  children: React.ReactNode;
  defaultSidebarOpen?: boolean;
  defaultShowHeader?: boolean;
}
