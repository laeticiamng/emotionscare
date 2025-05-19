
import { AudioTrack } from '@/types/audio';

/**
 * Obtenir l'URL audio d'une piste
 */
export const getAudioUrl = (track?: AudioTrack | null): string => {
  if (!track) return '';
  return track.audioUrl || track.url || '';
};

/**
 * Obtenir la description d'une piste audio
 */
export const getAudioDescription = (track?: AudioTrack | null): string => {
  if (!track) return '';
  return track.description || track.summary || '';
};

/**
 * Formater la durée d'une piste audio en mm:ss
 */
export const formatAudioDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Vérifier si une piste est en cours de lecture
 */
export const isTrackPlaying = (currentTrackId: string | null, track: AudioTrack): boolean => {
  return currentTrackId === track.id;
};
