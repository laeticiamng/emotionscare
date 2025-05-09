
// Music related types

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  cover_url?: string;
  genre?: string;
  mood?: string;
  emotions?: string[];
  intensity?: number;
  bpm?: number;
  is_favorite?: boolean;
  play_count?: number;
  created_at?: string;
  is_ai_generated?: boolean;
  track_number?: number;
  year?: number;
  // Aliases for compatibility with existing components
  cover?: string; // Alias for cover_url
  coverUrl?: string; // Alias for cover_url
  coverImage?: string; // Alias for cover_url
  audioUrl?: string; // Alias for url
  externalUrl?: string; // For external music platforms
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string; // Added for compatibility
  description?: string;
  cover_url?: string;
  created_at?: string;
  updated_at?: string;
  tracks: MusicTrack[];
  creator_id?: string;
  is_public?: boolean;
  play_count?: number;
  duration?: number;
  mood?: string;
  is_ai_generated?: boolean;
}

export interface MusicPreferences {
  favorite_genres?: string[];
  favorite_moods?: string[];
  volume_level?: number;
  auto_play?: boolean;
  recommended_intensity?: number;
  emotion_sync_enabled?: boolean;
}

export interface MusicRecommendation {
  track?: MusicTrack;
  playlist?: MusicPlaylist;
  reason?: string;
  confidence?: number;
  source: 'emotion' | 'preference' | 'popular' | 'history' | 'ai';
}
