
// Create or update this file to define emotion related types
export interface Emotion {
  id: string;
  name: string;
  intensity?: number;
  timestamp?: string;
  user_id?: string;
  userId?: string; // For compatibility
  emotion?: string; // For backward compatibility
  description?: string;
  color?: string;
  emoji?: string;
  label?: string; // Add label property
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity?: number;
  timestamp: string;
  source?: string;
  text?: string;
  emojis: string[];
  emotions?: Record<string, number>;
  user_id?: string;
  userId?: string; // For compatibility
  textInput?: string;
  audioUrl?: string;
  audio_url?: string; // For compatibility
  facialExpression?: string;
  transcript?: string;
  
  // Add missing properties that are used in components
  score?: number;
  primaryEmotion?: string;
  feedback?: string;
  ai_feedback?: string;
  date?: string;
  recommendations?: EmotionRecommendation[];
  category?: string;
}

export interface EmotionRecommendation {
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  actionLink?: string;
  actionText?: string;
  content?: string;
  category?: string;
  emotion?: string;
}

// Add EmotionScanFormProps for ScanTabContent component
export interface EmotionScanFormProps {
  userId?: string;
  onEmotionDetected?: () => void;
  onClose?: () => void;
  onScanComplete?: (result: EmotionResult) => void;
  defaultTab?: string;
  onProcessingChange?: (processing: boolean) => void;
}

// Add these interfaces for component compatibility
export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  className?: string;
}

export interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onClose?: () => void;
}

export interface EmojiEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onClose?: () => void;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onClose?: () => void;
  onProcessingChange?: (processing: boolean) => void;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showGraph?: boolean;
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
