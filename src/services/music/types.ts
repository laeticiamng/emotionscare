
// Internal types specific to music service implementation
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;   // Ajouté pour compatibilité avec MusicTrack
  isPlaying?: boolean; // Added for compatibility
  audioUrl?: string;   // Added for compatibility
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}
