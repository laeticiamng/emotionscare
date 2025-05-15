
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
export type UserModeType = 'B2C' | 'B2B-USER' | 'B2B-ADMIN' | 'B2B-SELECTION' | 'b2b_admin' | 'b2b_user' | 'b2c' | 'b2b-admin' | 'b2b-user';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode?: UserModeType;
  setUserMode?: (mode: UserModeType) => void;
}

// Journal Entry Type
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  text?: string;
  mood: string;
  mood_score?: number;
  emotion?: string;
  date: Date | string;
  tags?: string[];
  ai_feedback?: string;
  user_id?: string;
}

// Re-export important types for compatibility
export { User, UserRole, Theme, ThemeContextType, FontFamily, FontSize };
