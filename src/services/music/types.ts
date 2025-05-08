
// Types utilisés par les services de musique
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
}
