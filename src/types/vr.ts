
/**
 * VR Types
 * --------------------------------------
 * This file defines the official types for VR functionality.
 * Any new property or correction must be documented here and synchronized across all mockData and components.
 */

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string; // Official property name
  thumbnail?: string; // For backward compatibility, to be deprecated
  duration: number; // Duration in seconds
  difficulty: string;
  category: string;
  tags: string[];
  completion_count?: number; // Number of times the session was completed
  completionCount?: number; // Modern naming, prefer this
  average_rating?: number;
  averageRating?: number; // Modern naming, prefer this
  author_name?: string;
  authorName?: string; // Modern naming, prefer this
  created_at?: string;
  createdAt?: string; // Modern naming, prefer this
  intensity?: number;
  emotion_target?: string; // Target emotion to achieve with this session
  emotionTarget?: string; // Modern naming, prefer this
  recommended_mood?: string; // Mood this session is recommended for
  recommendedMood?: string; // Modern naming, prefer this
  preview_url?: string;
  previewUrl?: string; // Modern naming, prefer this
  is_audio_only?: boolean;
  isAudioOnly?: boolean; // Modern naming, prefer this
  audio_url?: string;
  audioUrl?: string; // Modern naming, prefer this
  benefits?: string[];
  theme?: string;
}

export interface VRSessionStats {
  sessionId: string;
  completions: number;
  averageRating: number;
  averageDuration: number;
  mostCommonEmotion?: string;
  userCount: number;
}

export interface VRSessionProgress {
  userId: string;
  sessionId: string;
  progress: number; // 0-100
  completed: boolean;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  feedback?: string;
  rating?: number;
}
