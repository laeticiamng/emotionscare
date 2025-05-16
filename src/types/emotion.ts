
export interface EmotionResult {
  id?: string;
  date?: string;
  emotion: string; 
  score: number;
  intensity?: number;
  confidence: number;
  text?: string;
  emojis: string[];
  recommendations?: string[];
  audioUrl?: string;
  source?: 'text' | 'voice' | 'video' | 'manual';
  feedback?: string;
  timestamp?: string;
  transcript?: string;
  user_id?: string;
}

export interface Emotion {
  emotion: string;
  score: number;
  confidence: number;
  intensity?: number;
  date?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onAnalysisComplete?: (result: EmotionResult) => void;
  continuous?: boolean;
  autoStart?: boolean;
  renderControls?: boolean;
  className?: string;
  stopAfterSeconds?: number;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onAnalysisComplete?: (result: EmotionResult) => void;
  continuous?: boolean;
  autoStart?: boolean;
  className?: string;
}

export interface AudioProcessorProps {
  headerText?: string;
  subHeaderText?: string;
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  continuous?: boolean;
}

export interface EnhancedEmotionResult extends EmotionResult {
  triggers?: string[];
  responseStrategy?: string;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month' | 'year';
  showHeader?: boolean;
  userId?: string;
  anonymized?: boolean;
  className?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  period: 'day' | 'week' | 'month' | 'year';
  userId?: string;
}

export interface MoodBasedRecommendationsProps {
  mood: string;
  standalone?: boolean;
  intensity?: number;
}
