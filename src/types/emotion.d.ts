
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
  user_id: string;
  date: string;
  score?: number;
  emojis?: string | string[];
  text?: string;
  audio_url?: string;
  audioUrl?: string;
  ai_feedback?: string;
  feedback?: string;
  primary_emotion?: string;
  emotion?: string;
  emotions?: EmotionValues;
  confidence?: number;
  intensity?: number;
  transcript?: string;
  recommendations?: string[];
  timestamp?: string;
  userId?: string;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: EmotionResult) => void;
  onFinish?: () => void;
  automaticMode?: boolean;
  instruction?: string;
  buttonText?: string;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
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
