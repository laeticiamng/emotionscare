
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export interface SidebarItem {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  disabled?: boolean;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}
