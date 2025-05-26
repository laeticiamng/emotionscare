
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  isOpen?: boolean;
  toggle?: () => void;
  expanded?: boolean;
}
