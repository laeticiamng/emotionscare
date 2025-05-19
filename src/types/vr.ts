
export interface VRSessionTemplate {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  preview_url?: string;
  duration: number | string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category?: string;
  tags?: string[];
  type?: string;
  audioUrl?: string;
  audio_url?: string;
  audioTrack?: string;
  videoUrl?: string;
  environment?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  lastUsed?: string | Date;
  averageRating?: number;
  totalRatings?: number;
}

export interface VRSession {
  id: string;
  templateId: string;
  template?: VRSessionTemplate;
  userId: string;
  completed: boolean;
  duration?: number;
  startedAt?: string;
  startTime?: string | Date;
  endedAt?: string;
  endTime?: string | Date;
  feedback?: string;
  rating?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  heartRateBefore?: number;
  heartRateAfter?: number;
  createdAt?: string;
  updatedAt?: string;
  metrics?: VRSessionMetrics;
}

export interface VRSessionMetrics {
  focusScore?: number;
  relaxationScore?: number;
  stressReduction?: number;
  moodImprovement?: number;
  mindfulnessScore?: number;
  breathingRateStart?: number;
  breathingRateEnd?: number;
  focusDuration?: number; // in seconds
  distractionCount?: number;
}

export interface VRSessionWithMusicProps {
  sessionTemplate?: VRSessionTemplate;
  onComplete?: () => void;
  onExit?: () => void;
  environment?: string;
  musicTrack?: string;
}

export interface VRStats {
  totalSessions: number;
  totalDuration: number;
  averageRating: number;
  mostUsedTemplate: string;
  stressReduction: number;
  moodImprovement: number;
  completionRate: number;
}

export type VRCategoryType = 'meditation' | 'breathing' | 'focus' | 'sleep' | 'stress' | 'anxiety' | 'all';

export type VRDifficultyType = 'beginner' | 'intermediate' | 'advanced' | 'all';

export type VRDurationType = 'short' | 'medium' | 'long' | 'all';
