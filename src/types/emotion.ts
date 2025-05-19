
export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  color: string;
  icon?: string;
  description?: string;
}

export interface EmotionResult {
  primaryEmotion?: string;
  emotions: Record<string, number>;
  confidence: number;
  recommendations?: EmotionRecommendation[];
  timestamp?: string;
  id?: string;
}

export interface EmotionRecommendation {
  title: string;
  content: string;
  type: string;
  description: string;
  category: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  processing?: boolean;
  className?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  inputText?: string;
  className?: string;
}

export interface EmojiEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  className?: string;
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  className?: string;
}
