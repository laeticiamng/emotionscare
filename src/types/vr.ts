
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  thumbnailUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  emotion?: string;
  popularity?: number;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  progress: number;
  completed: boolean;
  duration: number;
  createdAt: string;
  feedback?: string;
  rating?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  startedAt?: string; // Added missing property
  endedAt?: string;   // Added missing property
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
}

export interface VRSessionHistoryProps {
  userId: string;
  limit?: number;
}

export interface VRTemplateDetailProps {
  templateId: string;
}
