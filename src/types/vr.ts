export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  tags: string[];
  youtubeId?: string;
  lastUsed?: Date; // Added missing property
  popularity?: number;
  recommendedFor?: string[];
}

export interface VRHistoryListProps {
  onSelect: (template: VRSessionTemplate) => void;
  limit?: number;
}
