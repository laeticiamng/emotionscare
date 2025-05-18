
import { EmotionResult } from '@/types/emotion';

export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string;
  description?: string;
  duration: number;
  type?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  thumbnailUrl?: string;
  popularity?: number;
  rating?: number;
  tags?: string[];
  emotion?: string;
  features?: string[];
  lastUsed?: string;
  completionRate?: number;
  
  // Propriétés additionnelles utilisées dans l'application
  is_audio_only?: boolean;
  audio_url?: string;
  audioTrack?: string;
  preview_url?: string;
  theme?: string;
  environment?: string;
  intensity?: number;
  objective?: string;
  benefits?: string[];
}

export interface VRSession {
  id: string;
  templateId?: string;
  template?: VRSessionTemplate;
  userId: string;
  completed?: boolean;
  completedAt?: string;
  duration: number;
  startedAt?: Date | string;
  endTime?: Date | string;
  endedAt?: Date | string;
  startTime?: Date | string;
  emotionBefore?: string;
  emotionAfter?: string;
  date?: string;
  status?: 'completed' | 'in_progress' | 'scheduled';
  rating?: number;
  heartRateBefore?: number;
  heartRateAfter?: number;
  metrics?: {
    heartRate?: number[] | number;
    stressLevel?: number;
    focusLevel?: number;
  };
  feedback?: {
    rating?: number;
    comment?: string;
    comments?: string;
    improvements?: string[];
  };
  end_time?: Date | string;
}

export interface VRSessionData {
  id: string;
  template: VRSessionTemplate;
  startedAt: string;
  completedAt?: string;
  duration: number;
  emotionBefore: string;
  emotionAfter: string;
}

export interface VRSessionWithMusicProps {
  sessionId?: string;
  emotion?: string;
  onComplete?: (result: { emotionBefore: string; emotionAfter: string }) => void;
  className?: string;
  session?: VRSession;
}

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}
