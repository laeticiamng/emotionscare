
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
  id?: string;
  emotion?: string;
  confidence?: number;
  feedback?: string;
  emojis?: string[];
  timestamp?: string | Date;
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
  anonymized?: boolean;
}

export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  action?: string;
  category?: string;
  content?: string;
  emotion?: string;
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EmojiEmotionScannerProps {
  onSelect: (emotion: string) => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}
