
import { User } from '@/types/user';

export interface EmotionalTeamViewProps {
  teamMembers?: User[];
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean;
  userId?: string;
  teamId?: string;
  className?: string;
  onRefresh?: () => Promise<void>;
}

export interface EmotionDetail {
  name: string;
  score: number;
  color?: string;
  icon?: string;
}

export interface FacialEmotionScannerProps {
  onEmotionDetected: (emotionResult: EmotionResult) => void;
  compact?: boolean;
}

export interface EmotionSelectorProps {
  onSelect: (emotion: string, intensity: number) => void;
  preselected?: string;
  selectedEmotion?: string;
  onSelectEmotion?: React.Dispatch<React.SetStateAction<string>>;
  emotions?: any;
}

export interface VoiceEmotionAnalyzerProps {
  onEmotionDetected: (result: EmotionResult) => void;
  compact?: boolean;
}

export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  name: string;
  score: number;
  intensity?: number;
  confidence?: number;
  category?: string;
  source?: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
}

export interface EmotionResult {
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  feedback?: string;
  ai_feedback?: string;
  timestamp?: string;
  confidence?: number;
}
