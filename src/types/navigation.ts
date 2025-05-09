
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
