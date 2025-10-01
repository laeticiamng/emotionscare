// @ts-nocheck

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  source?: string;
  category?: string;
  urgency?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  imageUrl?: string;
  tags?: string[];
  created_at?: string;
  deadline?: string;
  completed?: boolean;
  related_emotion?: string;
  confidence?: number;
}

export interface RecommendationGroup {
  title: string;
  description?: string;
  recommendations: Recommendation[];
  type?: string;
}

export interface RecommendationCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  priority?: number;
}
