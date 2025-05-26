
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export interface SidebarItem {
  id: string;
  title: string;
  icon?: React.ComponentType<any>;
  path?: string;
  children?: SidebarItem[];
  badge?: string | number;
  isActive?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  variant?: 'default' | 'minimal' | 'compact';
}
