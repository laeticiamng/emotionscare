
export interface Emotion {
  id?: string;
  name: string;
  emoji?: string;
  color?: string;
  intensity?: number;
}

export interface EmotionResult {
  id?: string;
  emotion?: string;
  confidence?: number;
  intensity?: number;
  timestamp?: string;
  recommendations?: EmotionRecommendation[];
  emojis?: string[];
  text?: string;
  feedback?: string;
  source?: string;
  date?: string;
  user_id?: string;
}

export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  content?: string;
  category?: string;
}

export interface LiveVoiceScannerProps {
  onResult: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void);
  onProcessingChange?: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void);
}

export interface TeamOverviewProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
  isLoading?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
  anonymized?: boolean;
  data?: any[];
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
}

export interface EmojiEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void);
}
