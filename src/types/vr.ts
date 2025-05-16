
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  categoryId?: string;
  videoUrl?: string;
  audioUrl?: string;
  tags?: string[];
  type?: string;
  category?: string;
  level?: string;
  rating?: number;
  featured?: boolean;
  name?: string; // Added for VRHistoryList, VRPromptWidget, VRRecommendations
  lastUsed?: string | Date; // Added for VRHistoryList
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  completed: boolean;
  duration: number;
  feedback?: string;
  rating?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  template?: VRSessionTemplate;
}

export interface VRHistoryListProps {
  limit?: number;
  userId?: string;
  onSessionSelect?: (session: VRSession) => void;
  className?: string;
  templates?: VRSessionTemplate[]; // Added for HistoryList component
  sessions?: VRSession[]; // Added for VRSessionHistory component
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  onSessionSelect?: (session: VRSession) => void;
  className?: string;
  sessions?: VRSession[]; // Added for compatibility
}

export interface VRSessionWithMusicProps {
  sessionId: string;
  templateId?: string;
  onComplete?: (sessionData: VRSession) => void;
  autoPlay?: boolean;
  className?: string;
}
