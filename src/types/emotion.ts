
export interface Emotion {
  id: string;
  name?: string;
  score?: number;
  color?: string;
  icon?: string;
  date?: string;
  emotion?: string;
  confidence?: number;
  intensity?: number;
  user_id?: string;
  userId?: string; // Pour la compatibilité
  text?: string;
  emojis?: string[] | string;
  transcript?: string;
  audio_url?: string;
  audioUrl?: string; // Pour la compatibilité
  ai_feedback?: string;
  feedback?: string;
  recommendations?: string[];
  triggers?: string[];
  timestamp?: string;
  anxiety?: number;
  energy?: number;
  category?: string;
  description?: string;
  [key: string]: any; // Permet l'extension flexible
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  userId?: string; // Pour la compatibilité
  emotion: string;
  score?: number;
  confidence?: number;
  dominantEmotion?: string;
  primaryEmotion?: string;
  intensity?: number;
  text?: string;
  transcript?: string;
  emojis?: string[] | string;
  timestamp?: string;
  date?: string;
  triggers?: string[];
  feedback?: string;
  ai_feedback?: string; // Pour la compatibilité
  recommendations?: string[];
  audio_url?: string;
  audioUrl?: string; // Pour la compatibilité
  [key: string]: any; // Permet l'extension flexible
}

export interface EnhancedEmotionResult extends EmotionResult {
  recommendations?: string[];
  insights?: string[];
  icon?: string;
  color?: string;
  textColor?: string;
  description?: string;
  category?: string;
  coping_strategies?: string[];
  relatedActivities?: {
    id: string;
    title: string;
    description: string;
    duration: number;
  }[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  departmentId?: string;
  users?: any[];
  anonymized?: boolean;
  onUserClick?: (userId: string) => void;
  period?: 'day' | 'week' | 'month' | 'year' | string;
  userId?: string;
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  onRefresh?: () => void;
  showNames?: boolean;
  compact?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
  userId?: string;
  period?: 'day' | 'week' | 'month' | 'year';
  anonymized?: boolean;
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  users?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
    emotional_score?: number;
    anonymity_code?: string;
  }>;
  showNames?: boolean;
  compact?: boolean;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  showTranscript?: boolean;
  autoStart?: boolean;
  className?: string;
  stopAfterSeconds?: number;
  duration?: number;
}

export interface VoiceEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  quickMode?: boolean;
  showFeedback?: boolean;
  onResult?: (result: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
  showVisualizer?: boolean;
  className?: string;
}
