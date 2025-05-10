
import { MusicTrack } from './music';

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string | Date;
  end_time?: string | Date;
  duration?: number;
  completed: boolean;
  feedback?: string;
  emotion_before?: string;
  emotion_after?: string;
  score_before?: number;
  score_after?: number;
}

export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: 'guided' | 'meditation' | 'visualization' | 'relaxation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  video_url?: string;
  audio_url?: string;
  image_url?: string;
  emotion_tags?: string[];
  created_at: string | Date;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  musicTracks?: MusicTrack[];
  onCompleteSession: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
