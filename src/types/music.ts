
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover?: string;  
  coverImage?: string;  
  externalUrl?: string;  // For external player links
  mood?: string;
  genre?: string;
  intensity?: number;
  bpm?: number;
  tags?: string[];
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;  
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
  createdAt?: Date | string;
}

export interface MusicRecommendationCardProps {
  emotion: string;
  intensity: number;
  standalone?: boolean;
  className?: string;
  track?: MusicTrack;
  recommendationReason?: string;
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOpen?: boolean;
  currentTrack?: MusicTrack;
  onClose?: () => void;
}
