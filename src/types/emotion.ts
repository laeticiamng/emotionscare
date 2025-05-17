
export interface Emotion {
  name: string;
  id: string;
  category?: string;
  intensity?: number;
  color?: string;
  description?: string;
  icon?: string;
  emoji?: string;
  emojis?: string | string[];
}

export interface EmotionResult {
  id: string;
  user_id?: string;
  emotion: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  timestamp?: string;
  text?: string;
  feedback?: string;
  recommendations?: string[];
  ai_feedback?: string;
  emojis?: string | string[];
  date?: string; // Ajout du champ date manquant
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  autoStart?: boolean;
  scanDuration?: number;
  onResult?: (result: EmotionResult) => void;
  duration?: number;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showChart?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  data?: any[];
  isLoading?: boolean;
  error?: Error | null;
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}
