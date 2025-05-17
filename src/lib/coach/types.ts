
export type CoachEventType = 'achievement' | 'reminder' | 'feedback' | 'suggestion' | 'session_start' | 'session_started' | 'insight_generated' | string;

export interface CoachEvent {
  id: string;
  type: CoachEventType;
  title: string;
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
  read?: boolean;
}

export interface CoachInsight {
  id: string;
  userId: string;
  date: string;
  emotionTrend: string;
  mainEmotion: string;
  secondaryEmotion?: string;
  intensity: number;
  recommendations: string[];
  activities?: string[];
  journalPrompts?: string[];
}

export interface CoachSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  emotion: string;
  duration?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  benefits?: string[];
  steps?: string[];
}

export interface CoachAchievement {
  id: string;
  title: string;
  description: string;
  unlockCondition: string;
  icon?: string;
  category?: string;
  points?: number;
  unlockedAt?: string;
}
