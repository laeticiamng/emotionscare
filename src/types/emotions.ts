
export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity: number;
}

export interface EmotionScanOptions {
  text?: string;
  type: 'text' | 'voice' | 'image';
  imageFile?: File;
  audioBlob?: Blob;
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
}
