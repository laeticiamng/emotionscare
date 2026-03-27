// @ts-nocheck
// Types pour le sidebar

export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}
