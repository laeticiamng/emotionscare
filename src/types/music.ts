
// Types utilisés par les services de musique
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  cover?: string;
  coverUrl: string;
  emotion?: string;
  audioUrl: string;
  audio_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  emotion?: string;
  tracks: MusicTrack[];
  title?: string; // Ajouté pour la compatibilité
  description?: string; // Ajouté pour la compatibilité
}
