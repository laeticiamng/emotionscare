
// Navigation related types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface SidebarNavItem extends NavItem {
  items?: NavItem[];
  isActive?: boolean;
  isCollapsed?: boolean;
}

export interface UserNavItem {
  title: string;
  href: string;
  disabled?: boolean;
  action?: () => void;
}

export type MainNavItem = NavItem;
