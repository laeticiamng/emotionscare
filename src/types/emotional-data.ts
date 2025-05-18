
export interface EmotionalData {
  id: string;
  user_id: string;
  value: number;
  emotion: string;
  intensity: number;
  timestamp: string;
  source?: string;
  context?: string;
  note?: string;
  tags?: string[];
}

export interface EmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  intensity: number;
  recommendations: string[];
}
