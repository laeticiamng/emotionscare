
export type EmotionIntensity = 'low' | 'medium' | 'high' | number;

export interface EmotionResult {
  id?: string;
  emotion?: string;
  primaryEmotion?: string;
  secondaryEmotion?: string;
  confidence?: number;
  intensity?: number;
  timestamp?: string | Date;
  emojis?: string[];
  source?: 'facial' | 'voice' | 'text' | 'combined' | 'audio' | 'manual' | 'emoji' | 'scan';
  
  // Additional fields used by various components
  text?: string;
  transcript?: string;
  audioUrl?: string;
  audio_url?: string;
  facialExpression?: string;
  feedback?: string;
  ai_feedback?: string;
  score?: number;
  userId?: string;
  user_id?: string;
  date?: string;
  recommendations?: EmotionRecommendation[] | string[];
  textInput?: string;
}

export interface EmotionRecommendation {
  type: string;
  title: string;
  description: string;
  action?: string;
  category?: string;
  content?: string;
  emotion?: string;
}

export interface Emotion {
  id?: string;
  name: string;
  label?: string;
  emoji: string;
  color: string;
  intensity?: number;
  description?: string;
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

export interface EmotionData {
  id: string;
  userId: string;
  user_id?: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  source: string;
  text?: string;
  context?: string;
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

// Interfaces pour les composants de scan des émotions
export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  className?: string;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AudioProcessorProps {
  onResult?: (analysisResult: EmotionResult) => void;
  onProcessingChange?: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording?: boolean; 
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showGraph?: boolean;
}
