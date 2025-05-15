
import { User, UserRole } from './user';
import { Theme, ThemeContextType, FontFamily, FontSize } from './theme';

// Sidebar related types
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isMobile?: boolean;
}

// User mode related types
export type UserModeType = 'B2C' | 'B2B-USER' | 'B2B-ADMIN' | 'B2B-SELECTION';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
}

// Re-export important types for compatibility
export { User, UserRole, Theme, ThemeContextType, FontFamily, FontSize };
