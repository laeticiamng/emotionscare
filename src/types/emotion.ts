
export interface Emotion {
  id: string;
  name: string;
  color: string;
  intensity: number;
}

export interface EmotionResult {
  primaryEmotion: string;
  secondaryEmotion?: string;
  intensity: number;
  recommendations: EmotionRecommendation[];
  score?: number;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  action?: string;
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
}

export interface EmojiEmotionScannerProps {
  onSelect: (emotion: string) => void;
}
