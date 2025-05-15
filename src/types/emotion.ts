
export interface Emotion {
  id: string;
  name: string;
  category: string;
  value: number; // intensity 0-100
  color: string;
  icon?: string;
}

export interface EmotionResult {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  confidence?: number;
  intensity?: number;
  text?: string;
  transcript?: string;
  feedback?: string;
}

export interface EnhancedEmotionResult extends EmotionResult {
  tags?: string[];
  triggers?: string[];
  suggestions?: string[];
  dominant_emotion?: string;
  secondary_emotion?: string;
  emotion_analysis?: {
    valence: number;
    arousal: number;
    dominance: number;
  };
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  showMemberDetails?: boolean;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
  showFeedback?: boolean;
}

export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  duration?: number;
  showResults?: boolean;
  continuous?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
  showTrends?: boolean;
  period?: 'day' | 'week' | 'month';
}
