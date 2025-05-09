
// Navigation related types

export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: NavigationItem[];
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface MobileNavigationProps {
  items: NavigationItem[];
  open?: boolean;
  onClose?: () => void;
  user?: any;
}
