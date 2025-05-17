
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
  duration?: number;
  description?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: AudioTrack[];
  coverUrl?: string;
  createdAt: string;
  userId?: string;
}
