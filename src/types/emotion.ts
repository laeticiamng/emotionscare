
export type Emotion = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'disgust' 
  | 'surprise' 
  | 'neutral'
  | 'happy'
  | 'calm'
  | 'relaxed'
  | 'anxious'
  | 'stressed'
  | 'melancholic'
  | 'energetic'
  | 'focused'
  | 'excited'
  | 'worried'
  | 'tired'
  | 'content'
  | string;

export interface EmotionResult {
  emotion: Emotion;
  score?: number;
  confidence?: number;
  timestamp?: Date | string;
  date?: Date | string;  // Pour rétrocompatibilité
  feedback?: string;
  ai_feedback?: string;  // Pour rétrocompatibilité
  source?: 'text' | 'voice' | 'facial' | 'emoji';
  id?: string;
  userId?: string;
  user_id?: string;  // Pour rétrocompatibilité
  text?: string;
  textInput?: string;  // Pour rétrocompatibilité
  intensity?: number;
  emojis?: string[];
  recommendations?: EmotionRecommendation[];
  audioUrl?: string;
  transcript?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onAnalysisComplete?: (result: EmotionResult) => void;
  showControls?: boolean;
  showVisualizer?: boolean;
  autoStart?: boolean;
  duration?: number;
  className?: string;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
  showIndividuals?: boolean;
  anonymized?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  date?: Date | string;
  anonymized?: boolean;
}

export interface EmotionRecommendation {
  title: string;
  description?: string;
  content?: string;  // Pour rétrocompatibilité
  category?: string;
  type?: 'music' | 'activity' | 'meditation' | 'vr' | 'text';
  url?: string;
  iconUrl?: string;
}

export interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onAnalysisComplete?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export interface EmojiEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  onAnalysisComplete?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}
