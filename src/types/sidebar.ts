
import { ReactNode } from 'react';

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  children?: ReactNode;
  className?: string;
  side?: 'left' | 'right';
}

export interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}
