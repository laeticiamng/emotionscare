
export interface EmotionResult {
  id: string;
  userId: string;
  timestamp: Date;
  overallMood: string;
  emotions: Array<{
    emotion: string;
    confidence: number;
    intensity: number;
  }>;
  dominantEmotion: string;
  confidence: number;
  source: 'text' | 'voice' | 'image';
  recommendations: string[];
  metadata?: Record<string, any>;
}

export interface EmotionScanOptions {
  text?: string;
  audioData?: ArrayBuffer;
  imageData?: string;
  type: 'text' | 'voice' | 'image';
}
