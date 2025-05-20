
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  audioUrl?: string;
  description?: string;
  summary?: string;
  category?: string;
  mood?: string;
  tags?: string[];
  source?: string;
  artworkUrl?: string;
  cover?: string;
  emotion?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: AudioTrack[];
  description?: string;
  thumbnailUrl?: string;
  category?: string;
  emotion?: string;
}
