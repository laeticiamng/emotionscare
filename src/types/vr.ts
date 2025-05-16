
import { ReactNode } from 'react';
import { MusicTrack } from './music';

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  tags: string[];
  emotionTarget?: string;
  emotion_target?: string;
  difficulty?: string;
  benefits?: string[];
  thumbnailUrl?: string;
  category?: string;
  theme?: string;
  completionRate?: number;
  recommendedMood?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  rating?: number;
  feedback?: string;
  mood_before?: number;
  mood_after?: number;
  completed: boolean;
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSessionClick?: (session: VRSession) => void;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showViewAll?: boolean;
}

export interface VRSessionWithMusicProps {
  session: VRSessionTemplate;
  music?: MusicTrack[];
  onComplete?: (rating: number, feedback?: string) => void;
}
