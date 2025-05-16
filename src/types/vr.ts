
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  tags: string[];
  thumbnailUrl: string;
  category: string;
  emotion_target?: string;
  emotionTarget?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startDate: Date | string;
  endDate?: Date | string;
  completed: boolean;
  rating?: number;
  notes?: string;
  emotions?: string[];
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSelectSession?: (session: VRSession) => void;
}

export interface VRSessionHistoryProps {
  sessions: VRSession[];
}

export interface VRSessionWithMusicProps {
  session: VRSessionTemplate;
  onComplete?: (feedback: { rating: number; notes?: string }) => void;
  onExit?: () => void;
}
