
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  imageUrl?: string;
  settings?: {
    environment?: string;
    music?: string;
    guidance?: string;
    intensity?: number;
  };
  tags?: string[];
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  feedback?: {
    rating: number;
    comments?: string;
    emotionBefore?: string;
    emotionAfter?: string;
  };
  settings?: {
    environment: string;
    music?: string;
    guidance?: boolean;
    intensity?: number;
  };
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSessionSelect?: (session: VRSession) => void;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete?: (sessionData: VRSession) => void;
  onExit?: () => void;
}
