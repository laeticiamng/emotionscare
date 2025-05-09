
// Music related types

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover_url?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  audioUrl?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  tracks: MusicTrack[];
  emotion?: string;
  description?: string;
}

export interface MusicPreferences {
  autoplay: boolean;
  volume: number;
  repeat_mode: 'none' | 'all' | 'one';
  shuffle: boolean;
  favorite_genres: string[];
  favorite_tracks: string[];
  favorite_emotions?: string[];
}
