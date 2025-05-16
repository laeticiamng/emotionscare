
export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string;
  audioUrl?: string;
  ai_feedback?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
  duration?: number;
}

