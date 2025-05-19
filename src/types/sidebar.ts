
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  expanded?: boolean;
  isOpen?: boolean;
  toggle?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}
