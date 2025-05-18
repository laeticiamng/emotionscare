
export type EmotionIntensity = 'low' | 'medium' | 'high' | number;

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  intensity: number;
  timestamp?: string;
  emojis: string[];
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
  emotion?: string;
  category?: 'music' | 'vr' | 'exercise' | 'mindfulness' | 'general';
  content: string;
  title?: string;
}

// Type alternatif pour la rétrocompatibilité
export type LegacyEmotionRecommendation = string;

export interface Emotion {
  name: string;
  label?: string;
  emoji: string;
  color: string;
  intensity?: number;
  description?: string;
  keywords?: string[];
  id?: string;
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
}

export interface AudioProcessorProps {
  onResult: (analysisResult: EmotionResult) => void;
  onProcessingChange: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showGraph?: boolean;
}
