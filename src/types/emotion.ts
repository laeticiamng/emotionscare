
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
  date?: string; // Date pour l'affichage
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
  id?: string; // Ajouté pour la compatibilité
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
  onResult?: (result: EmotionResult) => void; // Ajouté pour compatibilité
  isProcessing?: boolean; // Ajouté pour compatibilité
  setIsProcessing?: (isProcessing: boolean) => void; // Ajouté pour compatibilité
  onProcessingChange?: (isProcessing: boolean) => void; // Ajouté pour compatibilité
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean; // Ajouté pour compatibilité
  dateRange?: [Date, Date]; // Ajouté pour compatibilité
  showGraph?: boolean; // Ajouté pour compatibilité
  showMembers?: boolean; // Ajouté pour compatibilité
  className?: string; // Ajouté pour compatibilité
  showDetails?: boolean; // Ajouté pour compatibilité
}
