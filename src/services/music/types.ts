
// Types utilisés par les services de musique
export interface Track {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
  name?: string;
}

export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
  title?: string;
}
