
import { ReactNode } from 'react';

export interface SidebarProps {
  children?: ReactNode;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
}
