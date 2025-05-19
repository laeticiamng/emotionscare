
// Define the EmotionScanFormProps type
export interface EmotionScanFormProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  onError?: (error: string) => void;
  className?: string;
  userId?: string;
  defaultTab?: string;
  onProcessingChange?: (isProcessing: boolean) => void;
  onScanComplete?: (result: any) => void;
  onClose?: () => void;
}

export interface Emotion {
  id: string;
  name: string;
  label?: string;
  description?: string;
  color?: string;
  icon?: string;
  intensity?: number;
  confidence?: number;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity: number;
  timestamp: string;
  source: string;
  emojis?: string[];
  text?: string;
  emotions?: Record<string, number>;
  // Compatibility fields
  primaryEmotion?: string;
  score?: number;
  date?: string;
  feedback?: string;
  ai_feedback?: string;
  user_id?: string;
  userId?: string;
  audioUrl?: string;
  audio_url?: string;
  textInput?: string;
  recommendations?: Array<EmotionRecommendation | string>;
  transcript?: string;
  facialExpression?: string;
}

export interface EmotionRecommendation {
  id?: string;
  type: string;
  title: string;
  description: string;
  content?: string;
  category?: string;
  emotion?: string;
  actionLink?: string;
  actionText?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  duration?: number;
  autoStart?: boolean;
  withTranscript?: boolean;
}

export interface TeamOverviewProps {
  period?: string;
  anonymized?: boolean;
  detailed?: boolean;
  className?: string;
}

export interface EmotionalTeamViewProps {
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date] | null;
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
  teamId?: string;
}

export interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  placeholder?: string;
}

export interface EmojiEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  duration?: number;
}
