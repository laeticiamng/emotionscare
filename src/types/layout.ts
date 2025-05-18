/**
 * Layout and Shell related types
 * --------------------------------------
 * Centralised definitions for layout components and context.
 */
import React from 'react';

/** Props for the main Shell layout */
export interface ShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
  className?: string;
}

/** Context provided by LayoutProvider */
export interface LayoutContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** True when the sidebar is visible (not collapsed) */
  sidebarOpen?: boolean;
}

/** Generic props for layout providers */
export interface LayoutProviderProps {
  children: React.ReactNode;
}
