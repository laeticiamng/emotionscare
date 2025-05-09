
// VR related types
import { MusicTrack } from './music';

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  emotion_before?: string;
  emotion_after?: string;
  notes?: string;
  rating?: number;
  is_completed: boolean;
  music_track_id?: string;
  music_track?: MusicTrack;
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  category: string;
  image_url?: string;
  is_guided: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  recommended_emotions?: string[];
  scenery_type?: string;
  has_music?: boolean;
  has_narration?: boolean;
  creator_id?: string;
  is_featured?: boolean;
  avg_rating?: number;
  total_sessions?: number;
}

export interface VRSessionStats {
  total_sessions: number;
  total_duration_minutes: number;
  avg_rating: number;
  most_used_template: {
    id: string;
    title: string;
    count: number;
  };
  emotion_improvements: Record<string, number>;
  weekly_sessions: Array<{
    date: string;
    count: number;
  }>;
}
