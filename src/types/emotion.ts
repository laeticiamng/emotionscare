// This file would contain the types related to emotions
export interface Emotion {
  id: string;
  emotion: string;
  name?: string;
  intensity: number;
  timestamp: string;
  source?: string;
  date?: string;
  emoji?: string;
  text?: string;
  transcript?: string;
  audioUrl?: string;
  feedback?: string;
  score?: number;
  userId?: string;
  user_id?: string;
  value?: number;
  tags?: string[];
  emojis?: string[] | string;
  ai_feedback?: string;
  recommendations?: EmotionRecommendation[] | string[];
  textInput?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity: number;
  source: string;
  timestamp: string;
  primaryEmotion?: string;
  score?: number;
  date?: string;
  emotions?: Record<string, number>;
  text?: string;
  transcript?: string;
  audioUrl?: string;
  feedback?: string;
  value?: number;
  ai_feedback?: string;
  emojis?: string[] | string;
  recommendations?: EmotionRecommendation[] | string[];
  tags?: string[];
  textInput?: string;
  facialExpression?: string;
  dominantEmotion?: {
    name: string;
    score: number;
  };
}

export interface EmotionRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  emotion: string;
  content?: string;
  category?: string;
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EmojiEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: string;
  showDetails?: boolean;
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

export interface EmotionScanFormProps {
  userId?: string;
  onEmotionDetected?: (result: EmotionResult) => void;
  onClose?: () => void;
  onScanComplete?: (result: EmotionResult) => void;
  defaultTab?: string;
  onProcessingChange?: (processing: boolean) => void;
  onComplete?: (result: EmotionResult) => void;
  onSave?: () => void;
  onSaveFeedback?: (feedback: string) => void;
  onScanSaved?: () => void;
}

export type EmotionHistory = EmotionResult[];

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  autoStart?: boolean;
  scanDuration?: number; // in seconds
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showDetails?: boolean;
}

export interface EnhancedEmotionResult extends EmotionResult {
  emotions: Record<string, number>;
  dominantEmotion: {
    name: string;
    score: number;
  };
}
