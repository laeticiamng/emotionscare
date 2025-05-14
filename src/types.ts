
export type {
  User,
  UserPreferences,
  UserPreferencesState,
  FontFamily,
  FontSize,
  ThemeName,
  InvitationVerificationResult,
  UserRole
} from './types/types';

export type {
  VRSessionTemplate,
  VRSession,
  VRHistoryListProps
} from './types/vr';

// Renommer ceci pour éviter les conflits d'exportation
export type {
  VRSessionWithMusicProps as VRSessionWithMusicPropsType
} from './types/vr';

export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  Track,
  ProgressBarProps,
  TrackInfoProps,
  VolumeControlProps
} from './types/music';

export type {
  NotificationFrequency,
  NotificationType,
  NotificationTone,
  Notification,
  NotificationPreference
} from './types/notification';

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

export type { 
  Emotion,
  EmotionResult,
  EnhancedEmotionResult
} from './types/emotion';

// Adding additional required types
export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  mood?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
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

export type { Badge } from './types/types';
export type { GamificationStats } from './types/types';
export type { Challenge } from './types/types';
export type { Period } from './types/types';
export type { EmotionalTeamViewProps } from './types/types';
export type { UserModeType } from './types/types';

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority: number;
  confidence: number; // Making this required
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
