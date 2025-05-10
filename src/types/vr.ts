
export interface VRSession {
  id: string;
  user_id: string;
  template_id?: string;
  started_at: string | Date;
  ended_at?: string | Date;
  duration?: number;
  emotions?: string[];
  completed: boolean;
  notes?: string;
  rating?: number;
  title?: string;
  
  // Added properties
  date?: string | Date;
  start_time?: string | Date;
  duration_seconds?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  duration?: number;
  category?: string;
  guided?: boolean;
  voice?: string;
  music_included?: boolean;
  difficulty?: string;
  emotions?: string[]; 
  
  // Added properties
  theme?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion_target?: string;
  completion_rate?: number;
  recommended_mood?: string;
  template_id?: string;
  popularity?: number;
  benefits?: string[];
}

export interface VRSessionWithMusicProps {
  session?: VRSession | VRSessionTemplate;
  template?: VRSessionTemplate;
  onComplete?: (feedback: any) => void;
  autoStart?: boolean;
  
  // Added properties
  musicTracks?: any[];
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
