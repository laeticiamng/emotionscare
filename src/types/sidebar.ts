
import { ReactNode } from 'react';

export interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
  isMobile: boolean;
  showMobileSidebar: boolean;
  toggleMobileSidebar: () => void;
}

export interface SidebarItemType {
  id: string;
  title: string;
  icon: ReactNode;
  path?: string;
  onClick?: () => void;
  badge?: string | number;
  submenu?: SidebarItemType[];
  requiresAuth?: boolean;
  requiredRoles?: string[];
  divider?: boolean;
  className?: string;
}

export interface SidebarProps {
  items: SidebarItemType[];
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}

export interface SidebarConfig {
  autoCollapseOnMobile: boolean;
  rememberState: boolean;
  showLabels: boolean;
  showIcons: boolean;
  miniOnHover: boolean;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
}
