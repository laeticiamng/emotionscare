
export type {
  User,
  UserPreferences,
  FontFamily,
  FontSize,
  ThemeName,
  InvitationVerificationResult
} from './types/user';

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
  Track
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

export interface Emotion {
  id: string;
  user_id: string;
  date: any;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string | null;
  ai_feedback?: string;
  created_at?: string;
  confidence?: number;
  intensity?: number;
  name?: string;
  category?: string;
  primaryEmotion?: {
    name: string;
    intensity?: number;
  };
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string;
  emotion?: string;
  score?: number;
  confidence?: number;
  feedback?: string;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
  primaryEmotion?: {
    name: string;
    intensity?: number;
  };
}
