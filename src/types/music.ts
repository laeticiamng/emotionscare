
// Add this file if it doesn't exist
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  cover_url?: string;
  audio_url: string;
  emotion_tag?: string;
  intensity?: number;
  externalUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
  cover_url?: string;
}

export interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  standalone?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
