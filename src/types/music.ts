
// Types for music features

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  genre?: string;
  album?: string;
  year?: number;
  bpm?: number;
  tags?: string[];
  audioUrl?: string; // Ajout de la propriété manquante
  coverImage?: string; // Autre alias pour coverUrl
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverImage?: string;
  emotion?: string;
  tags?: string[];
  title?: string; // Alias pour name
  mood?: string; // Alias pour emotion
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  repeat: 'off' | 'one' | 'all';
  shuffle: boolean;
  queue: MusicTrack[];
}

export interface MusicFilter {
  emotion?: string;
  genre?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  instrument?: string;
  duration?: 'short' | 'medium' | 'long';
}

export interface MusicRecommendation {
  track: MusicTrack;
  matchScore: number;
  reason?: string;
}

export interface MusicPreferences {
  favoriteGenres?: string[];
  dislikedGenres?: string[];
  favoriteArtists?: string[];
  preferredTempo?: 'slow' | 'medium' | 'fast';
  preferredInstruments?: string[];
  preferredMood?: string;
  volumeLevel?: number;
}
