
import { MusicTrack } from './music';

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string | Date;
  end_time?: string | Date;
  duration?: number;
  duration_seconds?: number;
  completed: boolean;
  feedback?: string;
  emotion_before?: string;
  emotion_after?: string;
  score_before?: number;
  score_after?: number;
  heart_rate_before?: number;
  heart_rate_after?: number;
  is_audio_only?: boolean;
  date?: string | Date;
}

export interface VRSessionTemplate {
  id: string;
  template_id: string;
  name: string;
  theme: string;
  description: string;
  duration: number;
  type: 'guided' | 'meditation' | 'visualization' | 'relaxation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  video_url?: string;
  audio_url?: string;
  image_url?: string;
  preview_url?: string;
  emotion_tags?: string[];
  emotion_target?: string;
  created_at: string | Date;
  completion_rate?: number;
  is_audio_only?: boolean;
}

export interface VRSessionWithMusicProps {
  session?: VRSessionTemplate;
  musicTracks?: MusicTrack[];
  onSessionComplete: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
