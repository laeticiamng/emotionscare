
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string; // Alternative URL property
  imageUrl?: string;
  cover?: string; // Alternative cover property
  coverImage?: string; // Another alternative cover property
  externalUrl?: string; // External URL for opening in music players
  mood?: string;
  genre?: string;
  releaseDate?: string;
  bpm?: number;
  key?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  is_favorite?: boolean;
  plays?: number;
  is_playing?: boolean;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  created_at?: string | Date;
  updated_at?: string | Date;
  mood?: string;
  user_id?: string;
  track_count?: number;
  duration?: number;
  is_public?: boolean;
  is_favorite?: boolean;
}

export interface MusicRecommendationCardProps {
  title: string;
  description: string;
  emotion?: string;
  onPlay?: () => void;
  tracks?: MusicTrack[];
  onClick?: () => void;
  className?: string;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  emotion?: string;
}
