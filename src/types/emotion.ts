
// Types for emotion-related components
export * from './index';

export interface EmotionAnalysisOptions {
  text?: string;
  audioUrl?: string;
  userId: string;
  include_feedback?: boolean;
  context?: string;
}

export interface EmotionAnalysisResponse {
  emotion: string;
  confidence: number;
  intensity?: number;
  feedback?: string;
  recommendations?: string[];
}
