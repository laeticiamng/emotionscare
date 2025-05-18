
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
  goalType?: string;
  interactive?: boolean;
  immersionLevel?: string; // Added missing field used in mockVRTemplates
  
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
  
  // Pour compatibilité avec les anciens composants
  coverUrl?: string;
  cover_url?: string;
  recommendedMood?: string;
  recommended_mood?: string;
  completion_rate?: number;
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
  template?: VRSessionTemplate;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  musicTrackId?: string;
}

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number; // Make heartRate optional to fix the error
  onStartSession: () => void;
  onBack: () => void;
}
