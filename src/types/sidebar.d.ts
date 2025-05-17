
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  isOpen?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  toggle?: () => void;
  expanded?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}
