
/**
 * VR Types
 * --------------------------------------
 * This file defines the official types for VR functionality.
 * Any new property or correction must be documented here and synchronized across all components.
 */

export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Legacy property - use title instead
  description: string;
  thumbnailUrl: string;
  thumbnail?: string; // Legacy property - use thumbnailUrl instead
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
  // Additional properties used by some components
  intensity?: number; // Added for compatibility with UserDashboardSections
  completionRate?: number; 
  completion_rate?: number; // Legacy property - use completionRate instead
  recommendedMood?: string;
  recommended_mood?: string; // Legacy property - use recommendedMood instead
  emotionTarget?: string;
  emotion_target?: string; // Legacy property - use emotionTarget instead
  preview_url?: string;
  is_audio_only?: boolean;
  audio_url?: string;
  audioUrl?: string; // Format camelCase
  benefits?: string[];
  theme?: string;
  emotion?: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  template?: VRSessionTemplate;
  startedAt: string;
  startTime?: string; // Legacy property - use startedAt instead
  endedAt?: string;
  endTime?: string; // Legacy property - use endedAt instead
  duration?: number;
  feedback?: {
    rating: number;
    comment?: string;
    emotionBefore?: string;
    emotionAfter?: string;
  };
  completed: boolean;
  progress?: number;
  // Legacy properties for compatibility
  emotionBefore?: string; 
  emotionAfter?: string;
  emotionTarget?: string;
  rating?: number;
}

export interface VRSessionWithMusicProps {
  vrTemplate: VRSessionTemplate;
  onComplete: (feedback: {rating: number, emotion: string}) => void;
}
