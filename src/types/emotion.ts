
export interface EmotionResult {
  emotion: string;
  score: number;
  confidence: number;
  timestamp?: Date;
  source?: 'voice' | 'text' | 'emoji';
  feedback?: string;
  emojis?: string[] | string;
  recommendations?: Array<string | { title: string; description?: string }>;
}

export interface EmotionRecord {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  timestamp: Date;
  source: 'scan' | 'manual' | 'vr' | 'coach';
  notes?: string;
}

// Add Emotion interface for older components
export interface Emotion {
  id: string;
  name: string;
  score: number;
  color: string;
  icon?: string;
}

// Add EmotionalTeamViewProps interface
export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month';
  anonymized?: boolean;
  dateRange?: [Date, Date];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}
