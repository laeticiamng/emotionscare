
export interface SidebarContextType {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  collapsed: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  
  isOpen?: boolean;
  toggle?: () => void;
  toggleCollapsed: () => void;
  expanded?: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
