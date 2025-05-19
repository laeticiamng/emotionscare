
export interface EmotionResult {
  emotion: string;
  confidence: number;
  secondaryEmotions?: string[];
  timestamp: string;
  source: 'text' | 'voice' | 'facial' | 'system';
  text?: string;
  duration?: number;
  userId?: string;
  sessionId?: string;
}

export type EmotionSource = 'text' | 'voice' | 'facial' | 'emoji' | 'system' | 'ai';

export interface EmotionHistoryItem extends EmotionResult {
  id: string;
}

export interface EmotionAnalysisOptions {
  includeSecondary?: boolean;
  detailed?: boolean;
  language?: string;
  sensitivity?: number;
}

export interface EmotionTrend {
  emotion: string;
  count: number;
  percentage: number;
}

export interface EmotionalState {
  dominant: string;
  secondary: string[];
  baseline: string;
  trends: EmotionTrend[];
  recentHistory: EmotionHistoryItem[];
}
