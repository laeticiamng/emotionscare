
export interface EmotionResult {
  emotion: string;
  intensity: number;
  source: 'text' | 'voice' | 'face' | 'emoji';
  score?: number;
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
  ai_feedback?: string;
  date: string;
  user_id?: string;
  session_id?: string;
}

export interface EmotionAnalysis {
  primary_emotion: string;
  secondary_emotions: string[];
  confidence: number;
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
  recommendations: string[];
}

export interface EmotionTrend {
  date: string;
  emotion: string;
  score: number;
  intensity: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  score: number;
  notes?: string;
  activities?: string[];
}

export type EmotionCategory = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'surprise' 
  | 'disgust' 
  | 'calm' 
  | 'excitement' 
  | 'anxiety' 
  | 'love' 
  | 'trust' 
  | 'anticipation';

export interface EmotionColors {
  [key: string]: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const EMOTION_COLORS: EmotionColors = {
  joy: {
    primary: '#fbbf24',
    secondary: '#fde047',
    background: '#fefce8'
  },
  sadness: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    background: '#eff6ff'
  },
  anger: {
    primary: '#ef4444',
    secondary: '#f87171',
    background: '#fef2f2'
  },
  fear: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    background: '#f5f3ff'
  },
  surprise: {
    primary: '#f97316',
    secondary: '#fb923c',
    background: '#fff7ed'
  },
  calm: {
    primary: '#10b981',
    secondary: '#34d399',
    background: '#ecfdf5'
  },
  anxiety: {
    primary: '#dc2626',
    secondary: '#ef4444',
    background: '#fef2f2'
  }
};
