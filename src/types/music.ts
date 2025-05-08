
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
  audioUrl?: string;   // Optional mais devrait être présent
  coverUrl?: string;   // Optional
  emotion?: string;    // Optional
  // Propriété url requise pour la compatibilité
  url: string;         // Requis pour la lecture audio
  cover?: string;      // Alias pour coverUrl, optionnel
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
