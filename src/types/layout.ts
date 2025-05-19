
import { Theme } from './theme';

export interface ShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
  className?: string;
}

export interface LayoutContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fullscreen: boolean;
  setFullscreen: (value: boolean) => void;
}

export interface LayoutProviderProps {
  children: React.ReactNode;
}

export interface SidebarProps {
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

export interface NavbarProps {
  userNavigation?: NavItem[];
  appNavigation?: NavItem[];
}

export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface FooterProps {
  className?: string;
}
