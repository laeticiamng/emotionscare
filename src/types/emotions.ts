
export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity: number;
}

export interface EmotionResult {
  id: string;
  userId: string;
  timestamp: Date;
  overallMood: string;
  emotions: EmotionData[];
  dominantEmotion: string;
  confidence: number;
  source: 'text' | 'voice' | 'image';
  recommendations: string[];
  metadata?: Record<string, any>;
  // Legacy fields for compatibility
  emotion?: string;
  text?: string;
  score?: number;
  date?: string;
}

export interface EmotionScanParams {
  text?: string;
  audioData?: ArrayBuffer;
  imageData?: string;
  type: 'text' | 'voice' | 'image';
}
