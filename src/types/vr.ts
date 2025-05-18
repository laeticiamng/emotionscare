
/**
 * VR Types
 * --------------------------------------
 * This file defines the official types for VR functionality.
 */

export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Legacy property - use title instead
  description: string;
  thumbnailUrl: string;
  duration: number;
  difficulty?: string;
  category?: string;
  tags?: string[];
  environment?: string; // Compatible with existing components
  immersionLevel?: 'low' | 'medium' | 'high';
  goalType?: 'relaxation' | 'focus' | 'meditation' | 'energizing';
  audioTrack?: string;
  interactive?: boolean;
  recommendedFor?: string[];
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  template?: VRSessionTemplate;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  feedback?: {
    rating: number;
    comment?: string;
    emotionBefore?: string;
    emotionAfter?: string;
  };
  completed: boolean;
  progress?: number;
}
