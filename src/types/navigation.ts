
import React from 'react';

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
