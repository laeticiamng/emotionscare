
export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date | string;
  endTime?: Date | string;
  startedAt?: Date | string;
  endedAt?: Date | string;
  createdAt?: Date | string;
  duration: number;
  completed: boolean;
  progress: number;
  feedback?: VRSessionFeedback;
  metrics?: {
    heartRate?: number | number[];
    stressLevel?: number;
    focusLevel?: number;
    [key: string]: any;
  };
}

export interface VRSessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  timestamp: Date | string;
  rating: number;
  emotionBefore: string;
  emotionAfter: string;
  comment: string;
}

export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  environmentId: string;
  category: string;
  intensity: number;
  difficulty: string;
  immersionLevel: string;
  goalType: string;
  interactive: boolean;
  tags: string[];
  recommendedMood?: string;
}

export interface VREnvironment {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
}
