
export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text: string;
  emojis: string[];
  recommendations: string[];
  secondary_emotion?: string;
  secondary_score?: number;
  feedback?: string;
  ai_feedback?: string;
  user_id?: string;
  userId?: string;
  timestamp?: string;
  date?: string;
  intensity?: number;
  transcript?: string;
  source?: 'facial' | 'voice' | 'text';
  notes?: string;
  emoji?: string;
}

export interface EmotionHistory {
  id: string;
  date: string;
  emotion: string;
  score: number;
  note?: string;
}

export interface EmotionAnalytics {
  dominant: string;
  frequency: Record<string, number>;
  trends: {
    emotion: string;
    values: number[];
    dates: string[];
  }[];
  recent: EmotionHistory[];
}

export interface EmotionScan {
  id: string;
  timestamp: string;
  primary_emotion: string;
  secondary_emotion?: string;
  confidence: number;
  source: 'facial' | 'voice' | 'text';
  notes?: string;
  emoji?: string;
}

export interface Emotion {
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  autoStart?: boolean;
  scanDuration?: number;
}

export interface EnhancedEmotionResult extends EmotionResult {
  emotions: Record<string, number>;
  dominantEmotion: {
    name: string;
    score: number;
  };
}

export interface EmotionalTeamViewProps {
  departmentId?: string;
  teamId?: string;
  period?: string;
}
