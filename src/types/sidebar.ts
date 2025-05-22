
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  open?: boolean;
  isOpen?: boolean;
  expanded?: boolean;
  setOpen?: (open: boolean) => void;
  toggle?: () => void;
}
