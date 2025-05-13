
export interface Emotion {
  name: string;
  confidence: number;
  description?: string;
  suggestions?: string[];
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  primaryEmotion?: Emotion;
  secondaryEmotions?: Emotion[];
  transcript?: string;
  timestamp?: string;
  faceDetected?: boolean;
  error?: string;
}
