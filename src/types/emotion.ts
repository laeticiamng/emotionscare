
/**
 * Basic emotion type
 */
export interface Emotion {
  name: string;
  value?: number;
  percentage?: number;
  color?: string;
  icon?: string;
  emoji?: string;
  timestamp?: string;
  description?: string;
}

/**
 * Result from emotion analysis
 */
export interface EmotionResult {
  emotion: string;
  value?: number;
  percentage?: number;
  score?: number;
  color?: string;
  intensity?: number;
  confidence?: number;
  timestamp?: string;
  date?: string;
  recommendations?: string[];
  feedback?: string;
  triggers?: string[];
  emojis?: string[];
  id?: string;
  user_id?: string;
  text?: string;
}

/**
 * Enhanced emotion result with additional data
 */
export interface EnhancedEmotionResult extends EmotionResult {
  relatedEmotions?: Emotion[];
  suggestedActions?: string[];
  musicRecommendations?: string[];
  emotionalTrend?: 'improving' | 'declining' | 'stable';
  wellbeingImpact?: 'positive' | 'negative' | 'neutral';
}

/**
 * Props for voice emotion scanner component
 */
export interface VoiceEmotionScannerProps {
  onResultsReady?: (results: EmotionResult) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  maxDuration?: number;
  className?: string;
  showVisualizer?: boolean;
}

/**
 * Props for live voice scanner component
 */
export interface LiveVoiceScannerProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  onTranscriptUpdate?: (transcript: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  autoStart?: boolean;
  maxDuration?: number;
  className?: string;
  visualizationMode?: 'wave' | 'bars' | 'circle';
}

/**
 * Props for emotional team view
 */
export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
  comparisonMode?: boolean;
  showIndividualData?: boolean;
}

/**
 * Props for team overview
 */
export interface TeamOverviewProps {
  teamId?: string;
  period?: string;
  data?: any;
  loading?: boolean;
  error?: Error | null;
}
