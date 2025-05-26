
export interface EmotionResult {
  emotion: string;
  confidence?: number;
  intensity?: number;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface EmotionData {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: Date;
  triggers?: string[];
  notes?: string;
}
