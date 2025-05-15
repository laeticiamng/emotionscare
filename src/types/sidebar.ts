
export interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  expanded: boolean;
  collapsed: boolean;
  setExpanded?: (expanded: boolean) => void;
  toggleExpanded?: () => void;
  toggleCollapsed: () => void;
}
