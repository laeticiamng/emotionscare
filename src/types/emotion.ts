export interface Emotion {
  id?: string;
  user_id?: string;
  date?: string | Date;
  emotion?: string;
  name?: string;
  score?: number;
  intensity?: number;
  confidence?: number;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  feedback?: string;
  audio_url?: string;
  transcript?: string;
  category?: string;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  date?: string | Date;
  emotion: string;
  score: number;
  confidence?: number;
  intensity?: number;
  text?: string;
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  transcript?: string;
  recommendations?: string[];
  primaryEmotion?: {
    name: string;
    score: number;
    confidence?: number;
  };
  dominantEmotion?: {
    name: string;
    score: number;
  };
}

export interface EmotionalData {
  id?: string;
  user_id?: string;
  userId?: string;
  date?: string | Date;
  text?: string;
  score?: number;
  emotion?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  feedback?: string;
}

export interface EmotionPrediction {
  predictedEmotion: string;
  confidence: number;
  emotion?: string;
  probability?: number;
  triggers?: string[];
  recommendations?: string[];
}

export interface EmotionScanFormProps {
  onScanSaved: () => void;
  onClose: () => void;
  userId?: string;
}

export interface FacialEmotionScannerProps {
  onEmotionDetected: (emotion: string, result: EmotionResult) => void;
  isScanning?: boolean;
  onToggleScanning?: () => void;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  showFilters?: boolean;
  className?: string;
}
