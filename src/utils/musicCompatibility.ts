
import { MusicTrack } from "@/types/music";

/**
 * Récupère l'URL de la couverture de l'album à partir de différents champs possibles
 */
export const getTrackCover = (track: MusicTrack): string | undefined => {
  return track.cover || track.coverUrl || track.coverImage;
};

/**
 * Récupère le titre de la piste à partir de différents champs possibles
 */
export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || '';
};

/**
 * Récupère le nom de l'artiste à partir de différents champs possibles
 */
export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || '';
};

/**
 * Récupère l'URL audio de la piste à partir de différents champs possibles
 */
export const getTrackAudioUrl = (track: MusicTrack): string | undefined => {
  return track.url || track.audioUrl || track.src || track.track_url;
};

/**
 * Interface pour les paramètres de musique liés aux émotions
 */
export interface EmotionMusicParams {
  emotion?: string;
  mood?: string;
  intensity?: number;
  genre?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  duration?: number;
}
