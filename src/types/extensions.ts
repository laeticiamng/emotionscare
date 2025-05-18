
export interface ExtensionMeta {
  id: string;
  name: string;
  description: string;
  category?: string;
}

export interface EmotionRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'music' | 'activity' | 'breathing' | 'meditation';
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  tags?: string[];
}
