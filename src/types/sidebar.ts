
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isMobile?: boolean;
}

export interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}
