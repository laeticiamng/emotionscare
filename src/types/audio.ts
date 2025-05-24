
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  artworkUrl?: string;
  cover?: string;
  description?: string;
  summary?: string;
  category?: string;
  mood?: string;
  emotion?: string;
  tags?: string[];
  source?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: AudioTrack[];
  description?: string;
  thumbnailUrl?: string;
  coverUrl?: string;
  category?: string;
  emotion?: string;
}
