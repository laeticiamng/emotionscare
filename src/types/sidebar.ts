
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  isOpen?: boolean;
  toggle?: () => void;
  expanded?: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  badge?: string | number;
  active?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}
