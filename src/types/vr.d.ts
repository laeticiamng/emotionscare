
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  tags: string[];
  emotionTarget?: string;
  emotion_target?: string;
  difficulty?: string;
  benefits?: string[];
  thumbnailUrl?: string;
  category?: string;
  theme?: string;
  completionRate?: number;
  recommendedMood?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  audio_url?: string;
  emotion?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  date: string;
  duration: number;
  completed: boolean;
  feedback?: string;
  score?: number;
  mood_before?: string;
  mood_after?: string;
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSelect: (session: VRSession) => void;
}

export interface VRSessionHistoryProps {
  session: VRSession;
  template: VRSessionTemplate;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: (feedback: string, score: number) => void;
  onExit: () => void;
}
