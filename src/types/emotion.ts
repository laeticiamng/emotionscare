
export interface EmotionValues {
  joy?: number;
  calm?: number;
  sadness?: number;
  anxiety?: number;
  anger?: number;
  fear?: number;
  surprise?: number;
  disgust?: number;
  neutral?: number;
  [key: string]: number | undefined;
}

export interface EmotionResult {
  id: string;
  user_id?: string;
  userId?: string;
  date?: string;
  timestamp?: string;
  score?: number;
  emojis?: string | string[];
  text?: string;
  audio_url?: string;
  audioUrl?: string;
  ai_feedback?: string;
  feedback?: string;
  primary_emotion?: string;
  emotion: string;
  emotions?: EmotionValues;
  confidence: number;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
  source?: 'text' | 'facial' | 'audio' | 'manual' | 'emoji' | 'voice';
  details?: Record<string, number>;
  duration?: number;
  facialExpression?: string;
  textInput?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onFinish?: () => void;
  automaticMode?: boolean;
  instruction?: string;
  buttonText?: string;
  onEmotionDetected?: (emotion: EmotionResult) => void;
  language?: string;
  autoStart?: boolean;
  duration?: number;
  className?: string;
  withAI?: boolean;
  onError?: (error: string) => void;
  continuous?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: any;
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  dateRange?: [Date, Date];
  departments?: string[];
  showIndividuals?: boolean;
  compact?: boolean;
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean;
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

export type Emotion = 
  'joy' | 
  'sadness' | 
  'anger' | 
  'fear' | 
  'disgust' | 
  'surprise' | 
  'trust' | 
  'anticipation' |
  'calm' |
  'anxiety' |
  'neutral';
