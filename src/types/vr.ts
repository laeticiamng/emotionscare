
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  coverImage?: string;
  author?: string;
  rating?: number;
  difficulty?: string;
  benefits?: string[];
  isPublic?: boolean;
  isPremium?: boolean;
  // Additional properties needed by components
  name?: string;
  is_audio_only?: boolean;
  audio_url?: string;
  preview_url?: string;
  lastUsed?: Date;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  endedAt?: Date;
  end_time?: Date;
  duration: number;
  feedback?: {
    rating: number;
    comment: string;
  };
  emotions?: {
    before: string;
    after: string;
  };
  notes?: string;
  completed?: boolean;
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
}

export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export interface VRSessionWithMusicProps {
  session: VRSessionTemplate;
  onComplete?: (feedback: { rating: number; comment: string }) => void;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  filter?: string;
}
