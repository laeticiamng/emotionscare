
import { MusicTrack } from '@/types/music';

/**
 * Obtient l'URL de la couverture d'une piste en gérant les différentes propriétés possibles
 * @param track La piste musicale
 * @returns L'URL de la couverture ou null si non disponible
 */
export const getTrackCover = (track: MusicTrack): string | null => {
  if (!track) return null;
  
  // Vérifier les différentes propriétés possibles
  return track.cover || track.coverUrl || track.coverImage || null;
};

/**
 * Obtient l'URL audio d'une piste en gérant les différentes propriétés possibles
 * @param track La piste musicale
 * @returns L'URL audio ou null si non disponible
 */
export const getTrackAudioUrl = (track: MusicTrack): string | null => {
  if (!track) return null;
  
  // Vérifier les différentes propriétés possibles
  return track.url || track.audioUrl || track.src || track.track_url || null;
};

/**
 * Obtient le titre d'une piste en gérant les différentes propriétés possibles
 * @param track La piste musicale
 * @returns Le titre ou "Titre inconnu" si non disponible
 */
export const getTrackTitle = (track: MusicTrack): string => {
  if (!track) return "Titre inconnu";
  
  // Vérifier les différentes propriétés possibles
  return track.title || track.name || "Titre inconnu";
};

/**
 * Obtient l'artiste d'une piste en gérant les différentes propriétés possibles
 * @param track La piste musicale
 * @returns L'artiste ou "Artiste inconnu" si non disponible
 */
export const getTrackArtist = (track: MusicTrack): string => {
  if (!track) return "Artiste inconnu";
  
  return track.artist || "Artiste inconnu";
};

/**
 * Normalise une piste musicale en assurant que toutes les propriétés nécessaires sont présentes
 * @param track La piste musicale à normaliser
 * @returns Une piste normalisée avec toutes les propriétés nécessaires
 */
export const normalizeTrack = (track: Partial<MusicTrack>): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: getTrackTitle(track as MusicTrack),
    name: track.name || track.title || "Titre inconnu",
    artist: getTrackArtist(track as MusicTrack),
    url: getTrackAudioUrl(track as MusicTrack) || '',
    audioUrl: track.audioUrl || track.url || track.src || track.track_url || '',
    src: track.src || track.url || track.audioUrl || track.track_url || '',
    track_url: track.track_url || track.url || track.audioUrl || track.src || '',
    cover: getTrackCover(track as MusicTrack) || '',
    coverUrl: track.coverUrl || track.cover || track.coverImage || '',
    coverImage: track.coverImage || track.cover || track.coverUrl || '',
    duration: track.duration || 0,
    emotion: track.emotion || '',
    intensity: track.intensity || 0.5,
    category: track.category || '',
    tags: track.tags || []
  };
};
