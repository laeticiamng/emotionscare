
// Navigation related types

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
  children?: NavigationItem[];
  badge?: number | string;
  disabled?: boolean;
  admin?: boolean;
}

export interface MobileNavigationProps {
  items: NavigationItem[];
  user?: any;
  onLogout?: () => void;
}

export interface SidebarProps {
  items: NavigationItem[];
  user?: any;
  onLogout?: () => void;
}

export interface NavigationConfig {
  mainNav: NavigationItem[];
  sidebarNav: NavigationItem[];
  adminNav: NavigationItem[];
}
