
export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number; // en secondes
  thumbnailUrl?: string;
  environmentId?: string;
  category: 'relaxation' | 'meditation' | 'adventure' | 'exploration' | 'contemplation';
  intensity: number; // 1-5
  difficulty: 'easy' | 'medium' | 'hard';
  immersionLevel: 'low' | 'medium' | 'high' | 'extreme';
  goalType: 'relaxation' | 'mindfulness' | 'stimulation' | 'inspiration';
  interactive: boolean;
  tags: string[];
  recommendedMood?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // durée réelle en millisecondes
  completed: boolean;
  progress: number; // 0-1
  feedback?: VRSessionFeedback;
  metrics?: VRSessionMetrics;
}

export interface VRSessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  timestamp: string;
  rating: number; // 1-5
  emotionBefore: string;
  emotionAfter: string;
  comment?: string;
}

export interface VRSessionMetrics {
  heartRate?: number[];
  stressLevel?: number;
  focusLevel?: number;
}

export interface VREnvironment {
  id: string;
  name: string;
  description: string;
  type: 'nature' | 'urban' | 'fantasy' | 'space' | 'underwater';
  ambientSounds: string[];
  visualEffects: string[];
  interactiveElements: boolean;
}
