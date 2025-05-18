
import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Utilitaire pour récupérer l'URL de couverture d'un track, en gérant les différentes propriétés possibles
 */
export function getTrackCover(track: MusicTrack | null): string | undefined {
  if (!track) return undefined;
  return track.coverUrl || track.cover || track.coverImage;
}

/**
 * Utilitaire pour récupérer le titre d'un track, en gérant les différentes propriétés possibles
 */
export function getTrackTitle(track: MusicTrack | null): string {
  if (!track) return 'No Track';
  return track.title || track.name || `Track ${track.id}`;
}

/**
 * Utilitaire pour récupérer l'artiste d'un track
 */
export function getTrackArtist(track: MusicTrack | null): string {
  if (!track) return 'Unknown Artist';
  return track.artist || 'Unknown Artist';
}

/**
 * Utilitaire pour récupérer l'URL audio d'un track
 */
export function getTrackAudioUrl(track: MusicTrack | null): string | undefined {
  if (!track) return undefined;
  return track.audioUrl || track.src || track.url || track.track_url;
}

/**
 * Convertit un tableau de MusicTrack en MusicPlaylist si nécessaire
 */
export function ensurePlaylist(input: MusicTrack[] | MusicPlaylist): MusicPlaylist {
  if (Array.isArray(input)) {
    return {
      id: `playlist-${Date.now()}`,
      name: 'Generated Playlist',
      tracks: input,
    };
  }
  return input;
}
