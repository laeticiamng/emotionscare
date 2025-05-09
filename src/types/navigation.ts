
// Navigation related types

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  children?: NavigationItem[];
  requiredRole?: string[];
  badge?: number | string;
  isNew?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

export interface Breadcrumb {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}

export interface NavigationState {
  isOpen: boolean;
  activeItemId?: string;
  expandedGroups: string[];
  breadcrumbs: Breadcrumb[];
}
