
/**
 * Types pour le système d'analyse émotionnelle
 */

export interface EmotionScore {
  emotion: string;
  confidence: number;
  intensity: number;
}

export interface EmotionResult {
  id: string;
  userId: string;
  timestamp: Date;
  overallMood: string;
  emotions: EmotionScore[];
  dominantEmotion: string;
  confidence: number;
  recommendations?: string[];
  musicSuggestions?: string[];
  source: 'text' | 'voice' | 'image' | 'manual';
  metadata?: {
    duration?: number;
    inputLength?: number;
    processingTime?: number;
  };
}

export interface EmotionAnalysisRequest {
  content: string;
  type: 'text' | 'voice' | 'image';
  userId: string;
  context?: string;
}

export interface EmotionTrend {
  date: string;
  averageMood: number;
  dominantEmotion: string;
  sessionCount: number;
}

export interface EmotionHistory {
  results: EmotionResult[];
  trends: EmotionTrend[];
  summary: {
    totalSessions: number;
    averageMood: number;
    mostFrequentEmotion: string;
    improvementScore: number;
  };
}
