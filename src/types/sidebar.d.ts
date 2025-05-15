
export interface SidebarContextType {
  expanded: boolean;
  isOpen: boolean;
  collapsed: boolean;
  setExpanded: (expanded: boolean) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setCollapsed: (collapsed: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
}
