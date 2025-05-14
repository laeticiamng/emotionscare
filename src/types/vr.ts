
export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  imageUrl?: string;
  recommendedFor?: string[];
  benefits?: string[];
  imageSrc?: string;
  tags?: string[];
  videoUrl?: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  heartRateBefore?: number;
  heartRateAfter?: number;
  emotionalStateBefore?: string;
  emotionalStateAfter?: string;
  feedbackRating?: number;
  feedbackComments?: string;
}

export interface VRHistoryListProps {
  sessions: VRSession[];
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete: () => void;
  onBack: () => void;
}
