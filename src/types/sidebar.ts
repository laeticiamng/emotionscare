// @ts-nocheck
/**
 * Sidebar Types - Système de navigation latérale
 * Types pour la sidebar, menus, items et états
 */

import React from 'react';

/** Type de contexte de la sidebar */
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isMobile: boolean;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
  expandedGroups: string[];
  toggleGroup: (groupId: string) => void;
  isGroupExpanded: (groupId: string) => boolean;
  width: number;
  collapsedWidth: number;
  pinned: boolean;
  setPinned: (pinned: boolean) => void;
}

/** Props du provider de sidebar */
export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  defaultPinned?: boolean;
  collapsedWidth?: number;
  expandedWidth?: number;
  breakpoint?: number;
  persistState?: boolean;
  storageKey?: string;
}

/** Configuration de la sidebar */
export interface SidebarConfig {
  defaultCollapsed: boolean;
  defaultPinned: boolean;
  collapsedWidth: number;
  expandedWidth: number;
  hoverDelay: number;
  animationDuration: number;
  breakpoint: number;
  showTooltips: boolean;
  enableKeyboardNav: boolean;
  persistState: boolean;
  storageKey: string;
}

/** Item de navigation */
export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  iconName?: string;
  href?: string;
  onClick?: () => void;
  badge?: SidebarBadge;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  shortcut?: string;
  children?: SidebarItem[];
  permissions?: string[];
  external?: boolean;
  newTab?: boolean;
}

/** Badge de l'item */
export interface SidebarBadge {
  content: string | number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  dot?: boolean;
  pulse?: boolean;
  max?: number;
}

/** Groupe de navigation */
export interface SidebarGroup {
  id: string;
  title?: string;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  permissions?: string[];
}

/** Section de la sidebar */
export interface SidebarSection {
  id: string;
  position: 'top' | 'middle' | 'bottom';
  groups: SidebarGroup[];
}

/** État de la sidebar */
export interface SidebarState {
  collapsed: boolean;
  pinned: boolean;
  hovered: boolean;
  mobileOpen: boolean;
  activeItem: string | null;
  expandedGroups: string[];
  width: number;
}

/** Événement de navigation */
export interface SidebarNavigationEvent {
  itemId: string;
  item: SidebarItem;
  timestamp: number;
  source: 'click' | 'keyboard' | 'programmatic';
}

/** Props du composant Sidebar */
export interface SidebarProps {
  sections: SidebarSection[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  logo?: React.ReactNode;
  logoCollapsed?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onNavigate?: (event: SidebarNavigationEvent) => void;
  onCollapse?: (collapsed: boolean) => void;
  renderItem?: (item: SidebarItem, isActive: boolean) => React.ReactNode;
}

/** Props d'un item de sidebar */
export interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  isCollapsed: boolean;
  depth: number;
  onSelect: (item: SidebarItem) => void;
}

/** Props d'un groupe de sidebar */
export interface SidebarGroupProps {
  group: SidebarGroup;
  isCollapsed: boolean;
  activeItem: string | null;
  expandedGroups: string[];
  onToggleGroup: (groupId: string) => void;
  onSelectItem: (item: SidebarItem) => void;
}

/** Thème de la sidebar */
export interface SidebarTheme {
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  text: string;
  textMuted: string;
  textActive: string;
  border: string;
  shadow: string;
  separator: string;
  scrollbar: string;
  scrollbarHover: string;
}

/** Animation de la sidebar */
export interface SidebarAnimation {
  duration: number;
  easing: string;
  collapse: string;
  expand: string;
  fadeIn: string;
  fadeOut: string;
}

/** Preset de configuration */
export interface SidebarPreset {
  name: string;
  config: Partial<SidebarConfig>;
  theme?: Partial<SidebarTheme>;
}

/** Statistiques d'utilisation */
export interface SidebarStats {
  totalNavigations: number;
  mostVisitedItems: Array<{ itemId: string; count: number }>;
  averageTimeCollapsed: number;
  collapseToggles: number;
  lastNavigation?: SidebarNavigationEvent;
}

/** Valeurs par défaut */
export const DEFAULT_SIDEBAR_CONFIG: SidebarConfig = {
  defaultCollapsed: false,
  defaultPinned: false,
  collapsedWidth: 64,
  expandedWidth: 256,
  hoverDelay: 200,
  animationDuration: 200,
  breakpoint: 768,
  showTooltips: true,
  enableKeyboardNav: true,
  persistState: true,
  storageKey: 'sidebar-state'
};

/** Thème par défaut */
export const DEFAULT_SIDEBAR_THEME: SidebarTheme = {
  background: 'var(--sidebar-bg, #ffffff)',
  backgroundHover: 'var(--sidebar-hover, #f3f4f6)',
  backgroundActive: 'var(--sidebar-active, #e5e7eb)',
  text: 'var(--sidebar-text, #1f2937)',
  textMuted: 'var(--sidebar-muted, #6b7280)',
  textActive: 'var(--sidebar-text-active, #111827)',
  border: 'var(--sidebar-border, #e5e7eb)',
  shadow: 'var(--sidebar-shadow, 0 1px 3px rgba(0,0,0,0.1))',
  separator: 'var(--sidebar-separator, #e5e7eb)',
  scrollbar: 'var(--sidebar-scrollbar, #d1d5db)',
  scrollbarHover: 'var(--sidebar-scrollbar-hover, #9ca3af)'
};

/** Presets disponibles */
export const SIDEBAR_PRESETS: SidebarPreset[] = [
  {
    name: 'default',
    config: DEFAULT_SIDEBAR_CONFIG
  },
  {
    name: 'compact',
    config: {
      defaultCollapsed: true,
      collapsedWidth: 48,
      expandedWidth: 200,
      showTooltips: true
    }
  },
  {
    name: 'wide',
    config: {
      defaultCollapsed: false,
      collapsedWidth: 72,
      expandedWidth: 320,
      showTooltips: false
    }
  },
  {
    name: 'minimal',
    config: {
      defaultCollapsed: true,
      defaultPinned: false,
      collapsedWidth: 56,
      expandedWidth: 240,
      hoverDelay: 100
    }
  }
];

/** Type guard pour SidebarItem */
export function isSidebarItem(value: unknown): value is SidebarItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'label' in value
  );
}

/** Vérifier si un item a des enfants */
export function hasChildren(item: SidebarItem): boolean {
  return Array.isArray(item.children) && item.children.length > 0;
}

/** Trouver un item par ID */
export function findItemById(
  sections: SidebarSection[],
  itemId: string
): SidebarItem | null {
  for (const section of sections) {
    for (const group of section.groups) {
      const found = findInItems(group.items, itemId);
      if (found) return found;
    }
  }
  return null;
}

/** Recherche récursive dans les items */
function findInItems(items: SidebarItem[], itemId: string): SidebarItem | null {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.children) {
      const found = findInItems(item.children, itemId);
      if (found) return found;
    }
  }
  return null;
}

/** Obtenir tous les IDs d'items */
export function getAllItemIds(sections: SidebarSection[]): string[] {
  const ids: string[] = [];

  const collectIds = (items: SidebarItem[]) => {
    for (const item of items) {
      ids.push(item.id);
      if (item.children) collectIds(item.children);
    }
  };

  for (const section of sections) {
    for (const group of section.groups) {
      collectIds(group.items);
    }
  }

  return ids;
}

export default {
  DEFAULT_SIDEBAR_CONFIG,
  DEFAULT_SIDEBAR_THEME,
  SIDEBAR_PRESETS,
  isSidebarItem,
  hasChildren,
  findItemById,
  getAllItemIds
};
