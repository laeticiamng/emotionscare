
export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  title?: string;
  category: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  tags: string[];
  youtubeId?: string;
  lastUsed?: Date;
  popularity?: number;
  recommendedFor?: string[];
  theme?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  benefits?: string[];
  emotions?: string[];
  completion_rate?: number;
  emotion_target?: string;
  level?: string;
  recommended_mood?: string;
}

export interface VRHistoryListProps {
  onSelect: (template: VRSessionTemplate) => void;
  limit?: number;
}

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
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: () => void;
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
