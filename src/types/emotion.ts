
// Types liés aux émotions
export interface Emotion {
  id?: string;
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
  intensity?: number;
  // Propriétés couramment utilisées mais manquantes
  user_id?: string;
  date?: string | Date;
  emotion?: string;
  score?: number;
  confidence?: number;
  category?: string;
  text?: string;
  transcript?: string;
  feedback?: string;
  audio_url?: string;
  ai_feedback?: string;
  recommendations?: string[];
  triggers?: string[];
  emojis?: string[] | string;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion: string;
  // Ajout des propriétés manquantes selon les erreurs signalées
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
  ai_feedback?: string;
  recommendations?: string[];
  audio_url?: string;
  [key: string]: any;  // Pour permettre d'autres propriétés flexibles
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
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  onEmotionDetected?: (emotion: string, result: EmotionResult) => void;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onEmotionDetected?: (emotion: string, result: EmotionResult) => void;
}
