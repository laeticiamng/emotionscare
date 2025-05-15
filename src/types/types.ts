
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
export type UserModeType = 'b2c' | 'B2C' | 'B2B-USER' | 'B2B-ADMIN' | 'B2B-SELECTION';

export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
}

// Additional types
export interface Story {
  id: string;
  title: string;
  content: string;
  type: string;
  seen: boolean;
  emotion?: string;
  image?: string;
  cta?: {
    label: string;
    route: string;
    text?: string;
    action?: string;
  };
}

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

export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  mood?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
}

// Re-export important types for compatibility
export { User, UserRole, Theme, ThemeContextType, FontFamily, FontSize };
