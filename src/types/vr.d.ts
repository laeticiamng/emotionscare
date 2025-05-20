
export interface VRSessionTemplate {
  id: string;
  title: string;
  name: string; // Added for compatibility
  description: string;
  duration: number;
  thumbnailUrl: string;
  environment?: string;
  environmentId?: string;
  category: string;
  tags?: string[];
  difficulty?: string;
  intensity?: number;
  immersionLevel?: string;
  features?: string[];
  rating?: number;
  audioUrl?: string;
  goalType?: string;
  interactive?: boolean;
  completionRate?: number;
  completion_rate?: number;
  emotion_target?: string;
  emotionTarget?: string;
  recommendedMood?: string;
  recommended_mood?: string;
  imageUrl?: string;
  coverUrl?: string;
  preview_url?: string;
  audio_url?: string;
}

export interface VREnvironment {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  tags?: string[];
  elements?: VRElement[];
}

export interface VRElement {
  id: string;
  type: 'scene' | 'object' | 'audio' | 'effect';
  name: string;
  assetUrl: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  interactive?: boolean;
  metadata?: Record<string, any>;
}

export interface VRSessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number;
  emotionBefore: string;
  emotionAfter: string;
  comment?: string;
  timestamp: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string | Date;
  endTime?: string | Date;
  startedAt?: string | Date;
  endedAt?: string | Date;
  createdAt?: string | Date;
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

export interface VRCredits {
  amount: number;
  lastRefill: string;
  nextRefill: string;
  limit: number;
}

export interface VRUserProfile {
  userId: string;
  completedSessions: number;
  favoriteEnvironment?: string;
  totalDuration: number;
  level: number;
  achievements: string[];
  credits: VRCredits;
  preferences: {
    difficulty: string;
    duration: number;
    categories: string[];
    immersionLevel: string;
  };
}

export interface VRTriggerEvent {
  type: 'emotion' | 'stress' | 'focus' | 'time' | 'location';
  value: string | number;
  threshold?: number;
  operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface VRRecommendation {
  id: string;
  templateId: string;
  userId: string;
  reason: string;
  priority: number;
  trigger?: VRTriggerEvent;
  createdAt: string;
  expiresAt?: string;
  clicked: boolean;
}

export interface VRSessionStatistics {
  totalSessions: number;
  averageDuration: number;
  favoriteCategory: string;
  emotionalImpact: {
    positive: number;
    neutral: number;
    negative: number;
  };
  mostCompletedTemplate: {
    id: string;
    title: string;
    count: number;
  };
}

export interface VRControlOptions {
  allowRotation?: boolean;
  allowMovement?: boolean;
  allowInteraction?: boolean;
  controlType?: 'gaze' | 'controller' | 'hands';
  sensitivity?: number;
}

export interface VRMockEnvironment {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  intensity: 'low' | 'medium' | 'high';
  theme: string;
}
