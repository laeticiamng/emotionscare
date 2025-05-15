
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url?: string;
  tags: string[];
  is_premium: boolean;
  environment: string;
  objective: string;
  // Add missing properties used in components
  is_audio_only?: boolean;
  theme?: string;
  preview_url?: string;
  audio_url?: string;
  thumbnailUrl?: string;
  image_url?: string;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string; // ISO date string
  end_time?: string; // ISO date string
  duration_seconds: number;
  completed: boolean;
  feedback?: {
    rating: number;
    comments?: string;
    emotions?: string[];
  };
  emotion_before?: string;
  emotion_after?: string;
  metrics?: {
    focus_score?: number;
    relaxation_score?: number;
    presence_score?: number;
  };
  template?: VRSessionTemplate;
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSessionSelect?: (session: VRSession) => void;
  isLoading?: boolean;
}

export interface VRSessionHistoryProps {
  userId: string;
  limit?: number;
  showViewAll?: boolean;
}

export interface VRSessionWithMusicProps {
  session: VRSessionTemplate;
  onComplete?: (metrics: VRSession['metrics']) => void;
  withMusic?: boolean;
  musicEmotion?: string;
}
