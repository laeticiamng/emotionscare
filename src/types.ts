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
  VRHistoryListProps,
  VRSessionWithMusicProps
} from './types/vr';

export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  Track
} from './types/music';

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

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion?: string;
  probability: number;
  confidence?: number;
  triggers?: string[];
  recommendations?: string[];
}

export interface MoodData {
  id?: string;
  date: Date | string;
  originalDate?: Date | string;
  value: number;
  label?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: string;
  seen?: boolean;
  image?: string;
  emotion?: string;
  cta?: {
    label: string;
    route: string;
    text?: string;
    action?: string;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  confidence: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  user_id?: string;
  unlocked_at?: string;
  progress?: number; // Added for compatibility
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  text?: string;
  emotion?: string;
  mood_score?: number;
  tags?: string[];
  ai_feedback?: string;
  title?: string; // Added missing property
  mood?: string; // Added missing property
}

export interface InvitationStats {
  total: number;
  pending: number;
  expired: number;
  accepted: number;
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
  role: UserRole;
  message?: string;
  expires_in_days: number;
  expiresIn?: number;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'therapist' | 'coach' | 'guest' | 'employee';

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  onVolumeChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: () => void;
}

export interface ChatResponse {
  id?: string;
  content?: string;
  message?: string; // Added for compatibility
  role?: string;
  timestamp?: string;
  emotion?: string; // Added for compatibility
}
