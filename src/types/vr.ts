
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
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  tracks?: MusicTrack[];
  onComplete: (duration: number) => void;
}
