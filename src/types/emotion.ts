
import { User } from '@/types/user';

export interface EmotionalTeamViewProps {
  teamMembers: User[];
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean;
}

export interface EmotionDetail {
  name: string;
  score: number;
  color?: string;
  icon?: string;
}

export interface FacialEmotionScannerProps {
  onEmotionDetected: (emotionResult: any) => void;
  compact?: boolean;
}

export interface EmotionSelectorProps {
  onSelect: (emotion: string, intensity: number) => void;
  preselected?: string;
}

export interface VoiceEmotionAnalyzerProps {
  onEmotionDetected: (result: any) => void;
  compact?: boolean;
}
