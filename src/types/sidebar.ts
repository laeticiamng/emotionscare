
export interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  expanded: boolean;
  collapsed: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
  toggleCollapsed: () => void;
  setCollapsed?: (collapsed: boolean) => void;
}
