
export interface MoodBasedRecommendationsProps {
  mood: string;
  standalone?: boolean;
  intensity?: number;
}

export interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  icon?: string;
  type: 'music' | 'activity' | 'meditation' | 'journal' | 'breathing' | 'community';
  action?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
  mood?: string;
  priority?: number;
  tags?: string[];
}
