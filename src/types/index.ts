
export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: Date;
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number | string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  tags?: string[];
  environment?: string;
  thumbnailUrl?: string;
  emotionTarget?: string;
  category?: string;
  name?: string;
  lastUsed?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  startTime: string | Date;
  endTime?: string | Date;
  duration: number;
  completed: boolean;
  progress?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  coverUrl?: string;
  emotion?: string;
}
