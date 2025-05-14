
export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  duration_seconds: number;
  type: string;
  category: string;
  difficulty: string;
  benefits: string[];
  tags: string[]; // Add missing property
  theme: string;
  preview_url: string;
  audio_url: string;
  is_audio_only: boolean;
  video_url?: string;
  completion_rate?: number;
  emotion_target?: string;
  created_at?: string;
  updated_at?: string;
  thumbnail_url?: string;
  lastUsed?: string | Date;
  emotions?: string[]; // For compatibility
  emotion?: string; // For compatibility
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  template?: VRSessionTemplate;
  duration_seconds: number;
  started_at: string;
  completed_at?: string;
  completed: boolean;
  notes?: string;
  heart_rate_before?: number;
  heart_rate_after?: number;
  is_audio_only: boolean;
  date?: string; // For compatibility
  startedAt?: string; // For compatibility
}

export interface VRHistoryEntry {
  id: string;
  date: Date;
  templateName: string;
  duration: number;
  completed: boolean;
  is_audio_only?: boolean;
}

export interface VRStats {
  totalSessions: number;
  totalMinutes: number;
  weeklyAverage: number;
  favoriteTemplate: string;
  longestStreak: number;
  currentStreak: number;
}

export interface VRSettings {
  quality: 'low' | 'medium' | 'high';
  audioEnabled: boolean;
  audioVolume: number;
  notifications: boolean;
  captionsEnabled: boolean;
  motionSensitivity: number;
}
