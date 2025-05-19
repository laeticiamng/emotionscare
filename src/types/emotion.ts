export interface Emotion {
  id: string;
  name: string;
  intensity: number;
  color: string;
  icon?: string;
  description?: string;
  emoji?: string;
  label?: string;
  keywords?: string[];
  confidence?: number;
  date?: string;
  source?: string;
  user_id?: string;
  userId?: string;
  score?: number;
  text?: string;
  feedback?: string;
  transcript?: string;
  audioUrl?: string;
  emotion?: string;
}

export interface EmotionResult {
  id: string;
  primaryEmotion?: string;
  emotion?: string;  // For backward compatibility
  emotions: Record<string, number>;  // Required field
  confidence: number;
  intensity?: number;
  score?: number;
  feedback?: string;
  ai_feedback?: string; // Used in LiveEmotionResults
  text?: string;
  transcript?: string;
  emojis?: string[];
  audioUrl?: string;
  audio_url?: string;
  recommendations?: EmotionRecommendation[];
  timestamp?: string;
  source?: string;
  date?: string;
  user_id?: string;  // Added to support FacialEmotionScanner
}

export interface EmotionRecommendation {
  title: string;
  content: string;
  type: string;
  description: string;
  category: string;
}

export interface EmotionScanFormProps {
  onScanComplete: (result: EmotionResult) => void;
  defaultTab?: string;
  onProcessingChange?: (isProcessing: boolean) => void;
  onEmotionDetected?: () => void; // Added for ScanTabContent
  onClose?: () => void;
  userId?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onScanComplete?: (result: EmotionResult) => void;
  processing?: boolean;
  className?: string;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  scanDuration?: number;
}

// Add proper interface for VoiceEmotionAnalyzerProps
export interface VoiceEmotionAnalyzerProps {
  onResult: (result: EmotionResult) => void;
  onStartRecording?: () => void;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date];
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

export interface TextEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  inputText?: string;
  className?: string;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  minLength?: number;
}

export interface EmojiEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onSelect?: (emotion: string) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface VoiceEmotionScannerProps {
  onResult: (result: EmotionResult) => void;
  onProcessingChange?: (processing: boolean) => void;
  className?: string;
}
