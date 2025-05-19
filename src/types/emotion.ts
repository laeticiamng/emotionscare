
export interface EmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  timestamp?: Date | string; // Allow both Date and string for flexibility
  source?: 'voice' | 'text' | 'emoji' | 'facial' | 'scan' | 'combined' | 'audio' | 'manual';
  feedback?: string;
  emojis?: string[] | string;
  recommendations?: Array<string | EmotionRecommendation | { title: string; description?: string }>;
  id?: string; // Added for compatibility
  intensity?: number; // Added for compatibility
  text?: string; // Added for compatibility
  textInput?: string; // Added for compatibility
  date?: string; // Added for compatibility
  transcript?: string; // Added for compatibility
  audioUrl?: string; // Added for compatibility
  ai_feedback?: string; // Added for backward compatibility
  userId?: string; // Added for backward compatibility
  user_id?: string; // Added for backward compatibility
}

export interface EmotionRecommendation {
  title: string;
  description?: string;
  content?: string;
  category?: string;
}

export interface EmotionRecord {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  source: 'scan' | 'manual' | 'vr' | 'coach';
  notes?: string;
}

// Add Emotion interface for older components
export interface Emotion {
  id: string;
  name: string;
  score: number;
  color: string;
  icon?: string;
  emotion?: string;
  confidence?: number;
  intensity?: number;
  description?: string;
}

// Add EmotionalTeamViewProps interface
export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

// Add AudioProcessorProps interface
export interface AudioProcessorProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording?: boolean;
  onError?: (error: string) => void;
  autoStop?: boolean;
  duration?: number;
  setIsProcessing?: (processing: boolean) => void;
}

// Add LiveVoiceScannerProps interface
export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  className?: string;
}

// Add TeamOverviewProps interface
export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showGraph?: boolean;
}

// Add text and emoji scanner props
export interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  onAnalysisComplete?: (result: EmotionResult) => void;
}

export interface EmojiEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  onAnalysisComplete?: (result: EmotionResult) => void;
}
