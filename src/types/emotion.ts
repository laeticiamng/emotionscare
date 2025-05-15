
export interface Emotion {
  id?: string;
  user_id?: string;
  date?: string | Date;
  emotion?: string;
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
  category?: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  text?: string;
  emojis?: string[] | string;
  transcript?: string;
  audio_url?: string;
  ai_feedback?: string;
  recommendations?: string[];
  triggers?: string[];
  feedback?: string;
  timestamp?: string;
  anxiety?: number;
  energy?: number;
  [key: string]: any;  // Allow for flexible extension
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
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
  date?: string | Date;
  triggers?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  audio_url?: string;
  [key: string]: any;  // Allow for flexible extension
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
  emotions?: {
    [key: string]: number;
  };
  dominantEmotion?: {
    name: string;
    score: number;
  } | string;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  departmentId?: string;
  users?: any[];
  anonymized?: boolean;
  onUserClick?: (userId: string) => void;
  period?: string;
  userId?: string;
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  onRefresh?: () => void;
}

export interface EmotionalData {
  id?: string;
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  context?: string;
  userId?: string; 
  source?: string;
  feedback?: string;
  user_id?: string;
}

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
  name?: string;
  intensity?: number;
  score?: number;
}

export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  autoStart?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
}
