
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  environment: string;
  intensity: 'low' | 'medium' | 'high';
  goal: string;
  thumbnailUrl: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  duration: number;
  emotionBefore?: number;
  emotionAfter?: number;
  notes?: string;
}
