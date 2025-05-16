
export interface EmotionResult {
  emotion: string;
  confidence?: number;
  timestamp?: Date | string;
  id?: string;
  source?: 'text' | 'voice' | 'face' | 'manual';
}

export interface EmotionData {
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  source: 'text' | 'voice' | 'face' | 'manual';
  userId: string;
  notes?: string;
}
