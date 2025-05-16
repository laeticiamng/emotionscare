
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  color: string;
  icon?: string;
}

export interface EmotionResult {
  id?: string;
  emotion: string;
  intensity: number;
  confidence?: number;
  date?: Date;
  text?: string;
  transcript?: string;
  recommendations?: string[];
  audioUrl?: string;
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onBack?: () => void;
  className?: string;
  period?: string;
  dateRange?: {start: Date, end: Date};
  showGraph?: boolean;
  showMembers?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  dateRange?: {start: Date, end: Date};
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}
