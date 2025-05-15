
import { ReactNode } from 'react';

export interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

export interface SidebarProps {
  children?: ReactNode;
  className?: string;
  collapsed?: boolean;
}
