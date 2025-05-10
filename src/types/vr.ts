
// Update VRSession interface
export interface VRSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  user_id: string;
  started_at?: Date | string;
  completed?: boolean;
  completed_at?: Date | string;
  template_id?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion_target?: string;
  status?: 'pending' | 'completed' | 'in_progress';
  benefits?: string[];
  instructions?: string;
  date?: Date | string; // Add this property
  start_time?: Date | string; // Add this property
  duration_seconds?: number; // Add this property
  heart_rate_before?: number; // Add this property
  heart_rate_after?: number; // Add this property
  mood_before?: string; // Add this property
  theme?: string; // Add this property
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  benefits?: string[];
  instructions?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  category?: string;
  tags?: string[];
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion_target?: string;
  template_id?: string;
  theme?: string;
  emotions?: string[]; // Add this property for UserDashboardSections
  completion_rate?: number;
  recommended_mood?: string;
  popularity?: number; // Add missing property
}

export interface VRSessionWithMusicProps {
  session: VRSession | VRSessionTemplate;
  musicTracks?: any[];
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
