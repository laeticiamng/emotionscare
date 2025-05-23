
export interface EmotionResult {
  id?: string;
  userId?: string;
  emotion: string;
  intensity: number;
  category?: string;
  timestamp?: string;
  source: 'emoji' | 'text' | 'facial' | 'voice';
  context?: string;
  analysis?: EmotionAnalysis;
}

export interface EmotionAnalysis {
  primaryEmotion: string;
  secondaryEmotions?: string[];
  triggers?: string[];
  suggestions?: string[];
  detailedScore?: Record<string, number>;
}

export interface EmotionHistoryEntry {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  source: string;
}

export type EmotionCategory = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'surprise' 
  | 'disgust' 
  | 'calm' 
  | 'anxiety'
  | 'neutral';

export interface EmotionData {
  category: EmotionCategory;
  label: string;
  color: string;
  icon?: string;
}

export const emotionCategoryMap: Record<EmotionCategory, EmotionData> = {
  joy: { category: 'joy', label: 'Joie', color: '#FFD700' },
  sadness: { category: 'sadness', label: 'Tristesse', color: '#6495ED' },
  anger: { category: 'anger', label: 'Colère', color: '#FF4500' },
  fear: { category: 'fear', label: 'Peur', color: '#9932CC' },
  surprise: { category: 'surprise', label: 'Surprise', color: '#FF8C00' },
  disgust: { category: 'disgust', label: 'Dégoût', color: '#8FBC8F' },
  calm: { category: 'calm', label: 'Calme', color: '#48D1CC' },
  anxiety: { category: 'anxiety', label: 'Anxiété', color: '#B22222' },
  neutral: { category: 'neutral', label: 'Neutre', color: '#A9A9A9' },
};
