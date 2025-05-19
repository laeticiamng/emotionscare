
import { ReactNode } from 'react';

export interface ShellProps {
  children?: ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
  className?: string;
}

export interface MainNavbarProps {
  className?: string;
  transparent?: boolean;
  logo?: string;
}

export interface MainFooterProps {
  className?: string;
  simple?: boolean;
}

export interface UserNavProps {
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
