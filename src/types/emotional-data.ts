// @ts-nocheck


export interface EmotionalData {
  id: string;
  user_id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  source?: string;
  context?: string;
  tags?: string[];
}

export interface EmotionalDataStats {
  dominant: string;
  average: number;
  count: number;
  timeline: {
    date: string;
    value: number;
    emotion: string;
  }[];
}

export interface EmotionalRecommendation {
  type: string;
  title: string;
  description: string;
  actionUrl?: string;
  actionText?: string;
}
