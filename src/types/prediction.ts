// @ts-nocheck

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  confidence: number;
  predictedEmotion?: string;
  triggers?: string[];
  recommendations?: string[];
  category?: string;
}
