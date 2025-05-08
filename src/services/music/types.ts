
// Types utilisés par les services de musique
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string; // Added to match usage
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}
