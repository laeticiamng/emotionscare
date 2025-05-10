
// Add or update this file
import { MusicTrack } from './music';

export interface VRSession {
  id: string;
  user_id: string;
  date: string | Date;
  duration: number;
  template_id?: string;
  emotion_before?: string;
  emotion_after?: string;
  mood_before?: string;
  mood_after?: string;
  notes?: string;
  start_time?: string | Date;
  duration_seconds?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  completed?: boolean;
}

export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  difficulty: string;
  tags: string[];
  preview_url?: string;
  thumbnail_url?: string;
  audio_url?: string;
  video_url?: string;
  guided?: boolean;
  is_audio_only?: boolean;
  emotion_target?: string;
  template_id?: string;
  theme?: string;
  title?: string;
  completion_rate?: number;
  recommended_mood?: string;
  benefits?: string[];
  emotions?: string[];
  popularity?: number;
}

export interface VRSessionWithMusicProps {
  session: VRSessionTemplate;
  onSessionComplete: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  musicTracks?: MusicTrack[];
}
