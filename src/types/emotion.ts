
// Types liés aux émotions et analyses d'émotions
export interface Emotion {
  id: string;
  user_id: string;
  date: string | Date;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  ai_feedback?: string;
  anxiety?: number;  // Ajouté pour compatibilité avec mockEmotions
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  score: number;  // Ajouté car manquant
  confidence?: number;
  timestamp?: Date | string;
  intensity?: number;
  triggers?: string[];
  recommendations?: string[];
  metadata?: Record<string, any>;
  date?: string | Date;
  user_id?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  history?: EmotionResult[];
  streak?: number;
  trend?: 'improving' | 'declining' | 'stable';
  previousEmotion?: string;
  emotionalBalance?: number;
}

export interface VoiceEmotionScannerProps {
  onStart?: () => void;
  onStop?: () => void;
  onResult?: (result: EmotionResult) => void;
  maxDuration?: number;
  recordingDelay?: number;
  autoStart?: boolean;
  emotion?: string;
  size?: 'sm' | 'md' | 'lg';
  mode?: 'minimal' | 'full' | 'compact';
  className?: string;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onScanStart?: () => void;
  onScanError?: (error: Error) => void;
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  companyId?: string;
  period?: 'day' | 'week' | 'month';
  limit?: number;
  compact?: boolean;
  showFilters?: boolean;
  className?: string;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  view?: 'emotions' | 'trends' | 'risks';
  period?: 'day' | 'week' | 'month' | 'year';
  showIndividualScores?: boolean;
  showAverageScore?: boolean;
  anonymized?: boolean;
}
