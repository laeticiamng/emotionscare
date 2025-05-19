
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'coach' 
  | 'journal' 
  | 'community' 
  | 'achievement'
  | 'badge'
  | 'challenge'
  | 'reminder'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'streak'
  | 'urgent';

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read'
  | NotificationType;

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement?: boolean;
    badge?: boolean;
    challenge?: boolean;
    reminder?: boolean;
    info?: boolean;
    warning?: boolean;
    error?: boolean;
    success?: boolean;
    streak?: boolean;
    urgent?: boolean;
  };
  frequency: NotificationFrequency;
  tone?: string;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export type NotificationsPreferences = NotificationPreference;

// Add missing category field to EmotionRecommendation
export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

// Add missing fields to EmotionResult
export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: string;
  recommendations?: EmotionRecommendation[];
  emotions: Record<string, number>;
  primaryEmotion?: string;
  intensity?: number;
  text?: string;
  emojis?: string[];
  audioUrl?: string;
  audio_url?: string;
  transcript?: string;
  feedback?: string;
  ai_feedback?: string;
  source?: string;
  date?: string;
}
