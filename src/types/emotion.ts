
export interface EmotionResult {
  emotion: string;
  confidence: number;
  secondaryEmotions?: string[];
  timestamp: string;
  source: 'text' | 'voice' | 'facial' | 'emoji' | 'system' | 'ai';
  text?: string;
  duration?: number;
  userId?: string;
  sessionId?: string;
  
  // Champs étendus pour la compatibilité
  id?: string;
  primaryEmotion?: string;
  score?: number;
  intensity?: number;
  feedback?: string;
  recommendations?: string[];
  emojis?: string[];
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

// Types étendus pour la compatibilité
export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  action?: string;
  link?: string;
  icon?: string;
}

export interface Emotion {
  name: string;
  color: string;
  icon?: string;
  description?: string;
}

export interface EmojiEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
}
