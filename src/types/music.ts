
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
  url: string;         // Required for audio playback
  audioUrl?: string;   // Optional alternative for compatibility
  coverUrl?: string;   // Optional
  cover?: string;      // Alias for coverUrl, optional
  emotion?: string;    // Optional
  isPlaying?: boolean; // Optional
  externalUrl?: string; // Optional - URL pour ouvrir dans un lecteur externe
}

export interface MusicPlaylist {
  id: string;
  name: string;
  emotion: string;
  tracks: MusicTrack[];
}

// Types pour les émotions musicales
export type MusicEmotion = 'calm' | 'happy' | 'focused' | 'energetic' | 'neutral';
