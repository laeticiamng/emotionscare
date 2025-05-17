
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
  duration?: number;
  description?: string;
  // Ajout des propriétés manquantes utilisées dans le code
  audioUrl?: string;
  emotion?: string;
  genre?: string;
  album?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: AudioTrack[];
  coverUrl?: string;
  createdAt: string;
  userId?: string;
  // Ajout des propriétés manquantes utilisées dans le code
  emotion?: string;
}
