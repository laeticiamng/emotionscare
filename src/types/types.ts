
import { Theme, ThemeContextType, FontFamily, FontSize } from './theme';
import { User, UserRole } from './user';

// Sidebar related types
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isMobile?: boolean;
}

// Authentication related types
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

// User mode related types
export interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
}

export type UserModeType = 'B2C' | 'B2B-USER' | 'B2B-ADMIN' | 'B2B-SELECTION';

// Time period for data filtering
export type Period = 'day' | 'week' | 'month' | 'year' | 'custom';

// Re-export important types to maintain backward compatibility
export { Theme, ThemeContextType, FontFamily, FontSize, User, UserRole };

// Export types from other files to ensure they're available
export type { 
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  EmotionalTeamViewProps,
  EmotionalData
} from './emotion';

export type {
  MusicTrack,
  MusicPlaylist,
  TrackInfoProps,
  VolumeControlProps,
  ProgressBarProps,
  MusicContextType,
  MusicDrawerProps,
  EmotionMusicParams
} from './music';

export type {
  VRSession,
  VRSessionTemplate,
  VRHistoryListProps,
  VRSessionWithMusicProps,
  VRTemplateGridProps
} from './vr';

export type {
  Notification,
  NotificationFrequency,
  NotificationType,
  NotificationTone,
  NotificationPreference
} from './notification';

// Additional types
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
}

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

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority: number;
  confidence: number;
  actionUrl?: string;
  actionLabel?: string;
  type?: 'activity' | 'content' | 'insight';
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected: number;
  sent: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  teams: Record<string, number>;
  recent_invites: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  role: string;
}

export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
  expires_in_days: number;
}

export interface InvitationVerificationResult {
  valid: boolean;
  isValid?: boolean;
  email?: string;
  role?: UserRole;
  expires_at?: string;
  message?: string;
  teamId?: string;
  companyId?: string;
  error?: string;
}
