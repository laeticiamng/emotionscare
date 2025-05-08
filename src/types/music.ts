
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;         // URL du fichier audio
  cover?: string;      // URL de l'image de couverture
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;    // Required
  audioUrl: string;
  coverUrl: string;
  emotion?: string;
  // Additional properties for compatibility
  url?: string;      // Alias for audioUrl
  cover?: string;    // Alias for coverUrl
  isPlaying?: boolean;
  externalUrl?: string; // URL pour ouvrir dans un lecteur externe
}

export interface MusicPlaylist {
  id: string;
  name: string;
  emotion: string;
  tracks: MusicTrack[];
}
