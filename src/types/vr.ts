
import { MusicTrack } from './music';

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  started_at: string | Date;
  completed_at?: string | Date;
  duration: number;
  feedback?: string;
  rating?: number;
  emotions_before?: string[];
  emotions_after?: string[];
  heart_rate_before?: number;
  heart_rate_after?: number;
  is_audio_only?: boolean;
  date?: string | Date;
  start_time?: string | Date;
  duration_seconds?: number;
  templateId?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  duration: number;
  category: string;
  environment: string;
  music_type?: string;
  prompts?: string[];
  benefits?: string[];
  created_at?: string | Date;
  user_count?: number;
  rating?: number;
  template_id?: string;
  theme?: string;
  completion_rate?: number;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion_target?: string;
  name?: string;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: {
    title?: string;
    duration?: number;
  };
  musicTracks?: MusicTrack[];
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  onComplete?: (duration: number) => void;
  tracks?: MusicTrack[];
}
