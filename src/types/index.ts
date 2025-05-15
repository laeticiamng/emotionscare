// Ajout des nouveaux types
import { ReactNode } from 'react';

// Emotion types
export interface EmotionResult {
  id: string;
  user_id?: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  date: string;
  emojis: string[];
  recommendations: string[];
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: 'onboarding' | 'notification' | 'emotion';
  seen: boolean;
  cta?: {
    label: string;
    route: string;
  };
}

export interface UserModeType {
  mode: 'b2c' | 'b2b-user' | 'b2b-admin';
}
