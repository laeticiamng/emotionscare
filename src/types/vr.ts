
export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  benefits?: string[];
  category?: string;
  level?: string;
  difficulty?: string;
  type?: string;
  tags?: string[];
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  preview_url?: string;
  audio_url?: string;
  previewUrl?: string;
  audioUrl?: string;
  emotion?: string;
  theme?: string;
  emotionTarget?: string;
  is_audio_only?: boolean;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: string | Date;
  end_time?: string | Date;
  duration?: number;
  completed?: boolean;
  mood_before?: string;
  mood_after?: string;
  template?: VRSessionTemplate;
  emotion_before?: string;
  emotion_after?: string;
  notes?: string;
  rating?: number;
  music_played?: boolean;
  settings?: {
    intensity?: number;
    volume?: number;
    visualEffects?: boolean;
  };
}

export interface VRHistoryListProps {
  sessions?: VRSession[];
  onSessionClick?: (session: VRSession) => void;
  className?: string;
  isLoading?: boolean;
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  onComplete?: () => void;
  musicEnabled?: boolean;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onTemplateClick?: (template: VRSessionTemplate) => void;
  isLoading?: boolean;
}

export type VRSessionWithMusicPropsType = {
  session: VRSession;
  onComplete?: () => void;
  musicEnabled?: boolean;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}
