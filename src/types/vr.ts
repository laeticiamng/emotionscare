
export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  theme: string;
  is_audio_only: boolean;
  preview_url: string;
  audio_url: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  benefits: string[];
  emotions: string[];
  popularity: number;
  template_id?: string;
  completion_rate?: number;
  emotion_target?: string;
  level?: string;
  recommended_mood?: string;
}

// Define and export the VRSession interface
export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  completed: boolean;
  template?: VRSessionTemplate;
  date?: string;
  duration?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  started_at?: string;
  completed_at?: string;
  emotion_before?: string;
  emotion_after?: string;
  mood_before?: string;
  mood_after?: string;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: () => void;
  
  // Adding these properties to match how VRActiveSession is using it
  session?: VRSessionTemplate;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
