
// Types liés à la réalité virtuelle
export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration: number;
  emotion?: string;
  tags?: string[];
  theme?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion_target?: string;
  difficulty?: string;
  benefits?: string[];
  thumbnailUrl?: string;
  category?: string;
  completionRate?: number;
  recommendedMood?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: Date;
  end_time?: Date;
  completed: boolean;
  mood_before?: string;
  mood_after?: string;
  score?: number;
  notes?: string;
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
  showFilters?: boolean;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete?: (sessionData: VRSession) => void;
  onExit?: () => void;
}

export interface VRTemplateGridProps {
  templates?: VRSessionTemplate[];
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  filter?: string;
  isLoading?: boolean;
}

export interface VRSessionWithMusicPropsType {
  template: VRSessionTemplate;
  onComplete?: (sessionData: VRSession) => void;
  onExit?: () => void;
}

export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  isLoading?: boolean;
  onViewDetails?: (sessionId: string) => void;
}
