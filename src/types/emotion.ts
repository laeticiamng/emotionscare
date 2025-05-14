
export interface EmotionResult {
  id?: string;
  user_id?: string;
  userId?: string;
  date?: string;
  emotion?: string;
  emotions?: any;
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
    score?: number;
  };
  dominantEmotion?: {
    name: string;
    score: number;
    confidence?: number;
  };
  source?: string;
  faceDetected?: boolean;
  error?: string;
  timestamp?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  emotions: {[key: string]: number};
  dominantEmotion: {
    name: string;
    score: number;
  };
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
    score?: number;
  };
}

export interface EmotionalTeamViewProps {
  teamId: string;
  timeframe?: string;
  userId?: string;
  period?: string;
  className?: string;
  onRefresh?: () => Promise<void>;
}

export interface FacialEmotionScannerProps {
  onEmotionDetected: (emotion: { name: string; score: number; intensity?: number; }) => void;
  className?: string;
  isScanning?: boolean;
  onToggleScanning?: () => void;
}

export interface EmotionScanFormProps {
  onComplete?: (result: EmotionResult) => void;
  userId?: string;
  onScanSaved?: () => void;
  onClose?: () => void;
}

export interface EmotionalData {
  userId?: string;
  emotions?: Emotion[];
  lastEmotion?: Emotion;
  streakDays?: number;
  emotionalBalance?: number;
  feedback?: string;
}

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
}
