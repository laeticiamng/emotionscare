
// Create emotion types file
export interface Emotion {
  name: string;
  score: number;
  color: string;
  icon?: string;
  emotion?: string;
  confidence?: number;
  intensity?: number;
}

export interface EmotionResult {
  id: string; 
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string;
  ai_feedback?: string; // Pour compatibilité
  timestamp?: string;
  emojis?: string | string[];
  recommendations?: string[];
  triggers?: string[];
  user_id?: string;
  userId?: string;
  date?: string; // Change to only accept string
  intensity?: number;
  transcript?: string;
  audioUrl?: string;
  audio_url?: string;
  source?: string; // Ajout pour AudioProcessor
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  recommendations?: string[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
  userId?: string;
  anonymized?: boolean;
  className?: string;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  scanDuration?: number;
  stopAfterSeconds?: number;
  duration?: number;
  className?: string;
}

export interface VoiceEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  audioOnly?: boolean;
  onResult?: (result: EmotionResult) => void;
  duration?: number;
  autoStart?: boolean;
  showVisualizer?: boolean;
  className?: string;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: any;
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}
