
// Si le fichier existe déjà, nous ajoutons ou modifions ces types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  last_login?: string;
}

export interface VRSession {
  id?: string;
  user_id: string;
  date: string;
  duration_seconds: number;
  location_url: string;
  heart_rate_before?: number | null;
  heart_rate_after?: number | null;
}

export interface VRSessionTemplate {
  id: string;
  theme: string;
  title?: string;
  description?: string;
  duration: number;
  preview_url: string;
  is_audio_only?: boolean;
  audio_url?: string;
  recommended_mood?: string;
  completion_rate?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  coverImage?: string;
  audioUrl: string;
  externalUrl?: string;
  mood?: string;
  isPlaying?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  mood?: string;
  tracks: MusicTrack[];
}

// Notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// Émotion / Scan
export interface EmotionScanResult {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  tags?: string[];
  context?: string;
  notes?: string;
}
