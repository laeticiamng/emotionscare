
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  timestamp: Date | string;
  userId?: string;
  source?: string;
  category?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion?: string;
  emotions?: { [key: string]: number };
  intensity?: number;
  timestamp?: Date | string;
  confidence?: number;
  source?: 'voice' | 'text' | 'image' | 'manual';
  emojis?: string;
  score?: number;
  feedback?: string;
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  onScanComplete?: (result: EmotionResult) => void;
  autoStart?: boolean;
  duration?: number;
  scanDuration?: number;
  showControls?: boolean;
  showVisualizer?: boolean;
  theme?: 'light' | 'dark';
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  dateRange?: [Date, Date];
  showIndividualMembers?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}
