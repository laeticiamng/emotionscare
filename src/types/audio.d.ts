
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  audioUrl?: string;
  description?: string; // Making sure this property exists
  summary?: string;
  category?: string;
  mood?: string;
  tags?: string[];
  source?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  tracks: AudioTrack[];
  description?: string;
  thumbnailUrl?: string;
  category?: string;
  emotion?: string;
}
