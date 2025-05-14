
export interface Emotion {
  id?: string;
  user_id?: string;
  date?: string;
  emotion?: string;
  score?: number;
  name?: string;
  intensity?: number;
  confidence?: number;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence?: number;
  intensity?: number;
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
