
export interface VRSessionTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  emotion?: string;
  type?: string;
  category?: string;
  authorId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isPublic?: boolean;
  usageCount?: number;
  rating?: number;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration?: number;
  mood?: {
    before?: string;
    after?: string;
  };
  feedback?: string;
  isCompleted?: boolean;
}

export interface VRHistoryListProps {
  sessions?: VRSession[];
  isLoading?: boolean;
  onSessionClick?: (session: VRSession) => void;
  showEmptyState?: boolean;
}

export interface VRSessionWithMusicProps {
  sessionId: string;
  templateId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}
