
import { EmotionName } from './emotion';

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // In seconds
  emotions?: {
    before?: EmotionName;
    after?: EmotionName;
    improvement?: number; // -100 to 100, percentage of improvement
  };
  completionRate?: number; // 0-100
  environment: string;
  musicId?: string;
  notes?: string;
  rating?: number; // 1-5
  feedback?: string;
}

export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // In minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  categoryId: string;
  environment: string;
  targetEmotion?: EmotionName;
  imageUrl?: string;
  recommendedMusic?: string[];
  voiceGuided?: boolean;
  interactivity?: 'none' | 'low' | 'medium' | 'high';
  premium?: boolean;
}

export interface VREnvironment {
  id: string;
  name: string;
  description: string;
  category: 'natural' | 'urban' | 'abstract' | 'fantasy';
  preview: string;
  available: boolean;
  premium?: boolean;
}

export interface VRCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface VRAnalytics {
  totalSessions: number;
  totalTimeSpent: number; // In minutes
  favoriteEnvironments: Array<{
    environmentId: string;
    name: string;
    count: number;
  }>;
  emotionalProgress: Array<{
    date: string;
    before: number; // 1-10 emotional state
    after: number; // 1-10 emotional state
  }>;
  improvements: {
    anxiety?: number; // Percentage improvement
    stress?: number;
    mood?: number;
    focus?: number;
  };
}
