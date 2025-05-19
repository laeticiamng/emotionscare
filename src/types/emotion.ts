
export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  content: string;
  category: string;
  emotion?: string;
}

export interface EmotionResult {
  id: string;
  emotion: string;
  emojis: string[];
  confidence: number;
  intensity?: number;
  timestamp: string; // ISO string
  feedback?: string;
  recommendations?: EmotionRecommendation[];
  source?: string;
  text?: string;
  emotions: Record<string, number>;
  score?: number;
  ai_feedback?: string; // For backward compatibility
  primaryEmotion?: string; // For EnhancedCoachAI
  date?: string; // For EmotionScanResult
  audioUrl?: string; // For AudioProcessor
  transcript?: string; // Added missing property
  audio_url?: string; // For compatibility
}

export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  autoStart?: boolean;
  scanDuration?: number; // in seconds
}

export interface EmotionScanFormProps {
  onScanComplete?: (result: EmotionResult) => void;
  userId?: string; // Added this prop
  onEmotionDetected?: () => void;
  onClose?: () => void;
}

export interface TeamOverviewProps {
  teamId?: string;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: string;
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

export interface TextEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
}

export interface EmojiEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
}

export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
}

// Define the Emotion type for EmotionalCheckIn
export interface Emotion {
  name: string;
  emoji?: string;
  color?: string;
  intensity?: number;
  value?: string;
  id?: string;
}
