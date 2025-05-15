
import React from 'react';

export interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  sidebarWidth?: number;
  sidebarPosition?: 'left' | 'right';
  isMobile?: boolean;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export interface SidebarProps {
  children?: React.ReactNode;
  collapsed?: boolean;
  toggled?: boolean;
  onToggle?: () => void;
  onCollapse?: () => void;
  className?: string;
  width?: string | number;
  position?: 'left' | 'right';
  showToggle?: boolean;
}
