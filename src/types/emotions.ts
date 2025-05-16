
export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string;
  audioUrl?: string; // Added to fix error
  ai_feedback?: string; // Added to fix error
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
  duration?: number;
}
