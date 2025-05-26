
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export interface SidebarItem {
  id: string;
  title: string;
  url: string;
  icon?: React.ComponentType;
  badge?: string | number;
  children?: SidebarItem[];
}
