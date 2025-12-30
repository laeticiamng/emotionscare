/**
 * Types pour le module Emotion Atlas
 */

export interface EmotionNode {
  id: string;
  emotion: string;
  intensity: number; // 0-100
  frequency: number; // nombre d'occurrences
  color: string;
  x: number;
  y: number;
  size: number;
  connections: string[]; // IDs des émotions liées
}

export interface EmotionConnection {
  source: string;
  target: string;
  strength: number; // 0-1
}

export interface AtlasData {
  nodes: EmotionNode[];
  connections: EmotionConnection[];
  timeRange: {
    start: Date;
    end: Date;
  };
  totalEntries: number;
  dominantEmotion: string;
}

export interface AtlasFilter {
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  minIntensity: number;
  sources: ('scan' | 'journal' | 'voice' | 'text')[];
  categories: ('positive' | 'neutral' | 'negative')[];
}

export interface AtlasInsight {
  id: string;
  type: 'pattern' | 'trend' | 'recommendation';
  title: string;
  description: string;
  emotion?: string;
  severity: 'info' | 'success' | 'warning';
  actionable: boolean;
}

export const EMOTION_COLORS: Record<string, string> = {
  joie: 'hsl(48, 95%, 53%)',
  tristesse: 'hsl(220, 70%, 50%)',
  colère: 'hsl(0, 80%, 50%)',
  peur: 'hsl(280, 60%, 45%)',
  surprise: 'hsl(170, 70%, 45%)',
  dégoût: 'hsl(90, 50%, 40%)',
  calme: 'hsl(200, 60%, 55%)',
  anxiété: 'hsl(25, 70%, 50%)',
  amour: 'hsl(340, 80%, 55%)',
  espoir: 'hsl(120, 50%, 50%)',
  gratitude: 'hsl(45, 80%, 55%)',
  fierté: 'hsl(270, 60%, 55%)',
  sérénité: 'hsl(180, 50%, 50%)',
  enthousiasme: 'hsl(35, 90%, 55%)',
  confusion: 'hsl(300, 30%, 50%)',
  frustration: 'hsl(15, 70%, 50%)',
  ennui: 'hsl(210, 20%, 50%)',
  mélancolie: 'hsl(230, 40%, 45%)',
};

export const EMOTION_CATEGORIES: Record<string, 'positive' | 'neutral' | 'negative'> = {
  joie: 'positive',
  tristesse: 'negative',
  colère: 'negative',
  peur: 'negative',
  surprise: 'neutral',
  dégoût: 'negative',
  calme: 'positive',
  anxiété: 'negative',
  amour: 'positive',
  espoir: 'positive',
  gratitude: 'positive',
  fierté: 'positive',
  sérénité: 'positive',
  enthousiasme: 'positive',
  confusion: 'neutral',
  frustration: 'negative',
  ennui: 'neutral',
  mélancolie: 'negative',
};
