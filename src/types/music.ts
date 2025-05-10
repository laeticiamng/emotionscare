
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  audioUrl?: string;
  url?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
  cover?: string;
}

export interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  standalone?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}
