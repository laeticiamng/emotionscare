
export interface EmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  timestamp?: Date;
  source?: 'voice' | 'text' | 'emoji';
  feedback?: string;
}

export interface EmotionRecord {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: Date;
  source: 'scan' | 'manual' | 'vr' | 'coach';
  notes?: string;
}
