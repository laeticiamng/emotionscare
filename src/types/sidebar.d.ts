
export interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  expanded: boolean;
  isOpen: boolean;
  collapsed: boolean;
  setExpanded: (expanded: boolean) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleCollapsed?: () => void;
  setCollapsed?: (collapsed: boolean) => void;
  showLabels?: boolean;
  setShowLabels?: (show: boolean) => void;
}
