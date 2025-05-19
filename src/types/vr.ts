
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  difficulty: string;
  category: string;
  tags: string[];
  immersionLevel: string;
  goalType: string;
  interactive: boolean;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  metrics?: Record<string, any>;
}

export interface VRSessionWithMusicProps {
  sessionId?: string;
  onComplete?: () => void;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
}

export interface VRTemplateDetailProps {
  templateId: string;
  onStart?: (template: VRSessionTemplate) => void;
}
