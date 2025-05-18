
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Récupérer l'URL de la couverture d'une piste (gère les différentes propriétés possibles)
export const getTrackCover = (track: MusicTrack): string | undefined => {
  return track.coverUrl || track.cover || track.coverImage;
};

// Récupérer le titre d'une piste (gère les différentes propriétés possibles)
export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || track.name || "Titre inconnu";
};

// Récupérer l'artiste d'une piste
export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || "Artiste inconnu";
};

// Récupérer l'URL audio d'une piste (gère les différentes propriétés possibles)
export const getTrackAudioUrl = (track: MusicTrack): string => {
  return track.audioUrl || track.url || track.track_url || track.src || "";
};

// S'assure qu'un tableau de pistes ou une playlist est formaté comme une playlist
export const ensurePlaylist = (input: MusicPlaylist | MusicTrack[]): MusicPlaylist => {
  if (Array.isArray(input)) {
    return {
      id: `dynamic-${Date.now()}`,
      name: 'Playlist dynamique',
      tracks: input
    };
  }
  return input;
};

// Filtre les pistes par humeur/émotion
export const filterTracksByMood = (tracks: MusicTrack[], mood: string): MusicTrack[] => {
  const lowerMood = mood.toLowerCase();
  return tracks.filter(track => 
    (track.mood?.toLowerCase() === lowerMood) || 
    (track.emotion?.toLowerCase() === lowerMood)
  );
};

// Crée une playlist à partir d'une émotion
export const createPlaylistForEmotion = (tracks: MusicTrack[], emotion: string): MusicPlaylist => {
  const filteredTracks = filterTracksByMood(tracks, emotion);
  
  return {
    id: `emotion-${emotion}-${Date.now()}`,
    name: `Playlist ${emotion}`,
    emotion: emotion,
    tracks: filteredTracks.length > 0 ? filteredTracks : tracks.slice(0, 5) // Fallback si pas de correspondance
  };
};
