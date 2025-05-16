
export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration: number;
  tags?: string[];
  emotion_target?: string;
  emotionTarget?: string;
  thumbnailUrl?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  duration: number;
  startTime?: Date;
  endTime?: Date;
  environment?: string;
  completionRate?: number;
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSelect?: (session: VRSession) => void;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
}

export interface VRSessionWithMusicProps {
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  musicTrackId?: string;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  filter?: string;
}
