
// Navigation related types used throughout the application

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ElementType;
  children?: NavigationItem[];
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  badge?: number | string;
  adminOnly?: boolean;
  requireAuth?: boolean;
}

export interface SidebarConfig {
  title: string;
  items: NavigationItem[];
}

// Pour la compatibilité avec les composants existants
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}
