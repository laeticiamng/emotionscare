
export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string;
  description: string;
  duration: number;
  tags?: string[];
  category: string;
  thumbnailUrl?: string;
  intensity: number;
  objective: string;
  type: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  completed?: boolean;
  feedback?: string;
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  template?: VRSessionTemplate;
  onComplete?: (feedback: string) => void;
  onExit?: () => void;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStartSession: () => void;
  onBack: () => void;
  heartRate?: number;
}
