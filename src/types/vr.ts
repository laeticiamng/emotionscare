
export interface VRSession {
  id: string;
  title?: string;
  duration: number;
  templateId?: string;
  template_id?: string;
  userId?: string;
  user_id?: string;
  date: Date | string;
  completed?: boolean;
  completedAt?: string;
  completed_at?: string;
  feedbackRating?: number;
  feedback_rating?: number;
  feedbackText?: string;
  feedback_text?: string;
  emotionBefore?: string;
  emotion_before?: string;
  emotionAfter?: string;
  emotion_after?: string;
  heartRateBefore?: number;
  heart_rate_before?: number;
  heartRateAfter?: number;
  heart_rate_after?: number;
  progress?: number;
  emotion?: string;
  emotionTarget?: string;
  emotion_target?: string;
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string;
  description: string;
  duration: number;
  recommended?: boolean;
  imagePath?: string;
  image_path?: string;
  videoUrl?: string;
  video_url?: string;
  audioUrl?: string;
  audio_url?: string;
  category?: string;
  tags?: string[];
  effects?: string[];
  popularityScore?: number;
  popularity_score?: number;
  thumbnailUrl?: string;
  thumbnail?: string;
  preview_url?: string;
  imageUrl?: string;
  completionRate?: number;
  completion_rate?: number;
  recommendedMood?: string;
  recommended_mood?: string;
  lastUsed?: string | Date;
  last_used?: string | Date;
  emotionTarget?: string;
  emotion_target?: string;
  emotion?: string;
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
  onSessionSelect?: (session: VRSession) => void;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: VRSession;
  onComplete?: (feedback: any) => void;
  onSessionComplete?: (feedback: any) => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

export type VRSessionWithMusicPropsType = VRSessionWithMusicProps;

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onTemplateSelect: (template: VRSessionTemplate) => void;
  featuredOnly?: boolean;
  filterCategory?: string;
  searchQuery?: string;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  onSessionSelect?: (session: VRSession) => void;
  showDetails?: boolean;
}
