
// This file would contain the types related to emotions
export interface Emotion {
  id: string;
  emotion: string;
  name?: string; // Added for compatibility
  intensity: number;
  timestamp: string;
  source?: string;
  date?: string; // Added for compatibility
  emoji?: string; // Added for compatibility
  text?: string; // Added for compatibility
  transcript?: string; // Added for compatibility
  audioUrl?: string; // Added for compatibility
  feedback?: string; // Added for compatibility
  score?: number; // Added for compatibility
  userId?: string; // Added for compatibility
  user_id?: string; // Added for compatibility
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity: number;
  source: string;
  timestamp: string;
  recommendations?: (string | EmotionRecommendation)[];
  feedback?: string;
  ai_feedback?: string;
  emojis?: string[];
  emotions?: Record<string, number>;
  // Additional optional fields for compatibility
  textInput?: string;
  audioUrl?: string;
  audio_url?: string; // Added for compatibility
  facialExpression?: string;
  text?: string;
  transcript?: string;
  // Adding fields that are used in components but weren't in the type
  primaryEmotion?: string;
  score?: number;
  date?: string;
}

export interface EmotionRecommendation {
  id?: string;
  title: string;
  description?: string;
  type?: string;
  category?: string;
  content?: string; // Added for compatibility
  actionUrl?: string; // Added for compatibility
  icon?: string; // Added for compatibility
}

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  isProcessing?: boolean; // Added for compatibility
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>; // Added for compatibility
}

export interface EmojiEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  isProcessing?: boolean; // Added for compatibility
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>; // Added for compatibility
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
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

export interface EmotionScanFormProps {
  onScanComplete?: (result: EmotionResult) => void;
  userId?: string;
  onEmotionDetected?: (result: EmotionResult) => void;
  onClose?: () => void;
  defaultTab?: string;
  onProcessingChange?: (processing: boolean) => void;
}

export type EmotionHistory = EmotionResult[];
