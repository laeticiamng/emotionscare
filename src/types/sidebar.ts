
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  expanded?: boolean;
  isOpen?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  toggle?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}
