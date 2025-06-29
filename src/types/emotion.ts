
export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: Date;
  source: 'facial_analysis' | 'voice_analysis' | 'text_analysis';
  details?: {
    valence?: number;
    arousal?: number;
    intensity?: number;
  };
}

export interface EmotionAnalysisConfig {
  duration: number;
  sensitivity: number;
  sources: ('facial' | 'voice' | 'text')[];
}
