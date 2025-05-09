
import { ReactNode } from 'react';

export interface MainNavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  label?: string;
}

export interface SidebarNavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  label?: string;
  items?: SidebarNavItem[];
}

export interface NavItemWithChildren extends MainNavItem {
  items: NavItemWithChildren[];
}

export interface NavItem extends MainNavItem {}
