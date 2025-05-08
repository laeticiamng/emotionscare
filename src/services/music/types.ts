
// Internal types specific to music service implementation
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  isPlaying?: boolean; // Added for compatibility
  audioUrl?: string;   // Added for compatibility
  coverUrl?: string;   // Added for compatibility with MusicTrack
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}
