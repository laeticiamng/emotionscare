
export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string;
  description?: string;
  duration?: number;
  category?: string;
  difficulty?: string;
  intensity?: string;
  environment?: string;
  thumbnailUrl?: string;
  thumbnail?: string;
  backgroundUrl?: string;
  audioUrl?: string;
  recommendedMood?: string;
  theme?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  completed?: boolean;
  feedback?: VRSessionFeedback;
}

export interface VRSessionFeedback {
  id: string;
  sessionId: string;
  rating: number;
  comment?: string;
  emotionBefore?: string;
  emotionAfter?: string;
  improvements?: string;
  timestamp: string;
}

export interface VREnvironment {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  assetUrl?: string;
}
