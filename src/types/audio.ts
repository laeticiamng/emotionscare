
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  coverImage?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  category?: string;
  tags?: string[];
  description?: string;
  summary?: string;
  mood?: string;
  premium?: boolean;
  featured?: boolean;
  createdAt?: string;
}

export interface AudioProcessorProps {
  onResult?: (result: any) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  isRecording?: boolean;
  duration?: number;
  autoStart?: boolean;
  className?: string;
  mode?: 'voice' | 'ambient' | 'music';
  visualize?: boolean;
  children?: React.ReactNode;
}

export type AudioPlayerState = 'playing' | 'paused' | 'loading' | 'error' | 'idle';

export interface PlaylistItem {
  id: string;
  trackId: string;
  position: number;
  playlistId: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  tracks: AudioTrack[];
  userId?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
