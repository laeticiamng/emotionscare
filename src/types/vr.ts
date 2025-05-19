
export interface VRSessionTemplate {
  id: string;
  title: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  duration: number;
  difficulty: string;
  category: string;
  audioUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
  rating?: number;
  features?: string[];
  environment?: string;
  immersionLevel?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration: number;
  completed: boolean;
  progress?: number;
  feedback?: VRSessionFeedback;
  notes?: string;
}

export interface VRSessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number;
  comment?: string;
  emotions?: Record<string, number>;
  timestamp: Date | string;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: VRSession;
  onComplete?: (session: VRSession) => void;
  onExit?: () => void;
  musicEnabled?: boolean;
  backgroundMusic?: string;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart?: () => void;
  onBack?: () => void;
}

export interface VRSessionPlayerProps {
  session: VRSession;
  template: VRSessionTemplate;
  onComplete?: (session: VRSession) => void;
  onExit?: () => void;
}

export type VRDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
