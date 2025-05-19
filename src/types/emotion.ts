
export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  content: string;
  category: string;
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
  userId?: string;
  onEmotionDetected?: () => void;
  onClose?: () => void;
}

export interface TeamOverviewProps {
  teamId?: string;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
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
