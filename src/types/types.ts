
// Adding to the existing types.ts file, these definitions for SidebarContextType and ThemeButtonProps

import { Theme } from '@/contexts/ThemeContext';

export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isMobile?: boolean;
}

export interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
  collapsed?: boolean;
}

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  isAuthenticated: boolean;
}

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
}

export type UserModeType = 'B2C' | 'B2B-USER' | 'B2B-ADMIN' | 'B2B-SELECTION';
