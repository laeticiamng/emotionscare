
import { AudioTrack } from '@/types/audio';

/**
 * Get the URL for an audio track
 */
export const getAudioUrl = (track: AudioTrack): string => {
  return track.url || '';
};

/**
 * Get a display description for an audio track
 */
export const getAudioDescription = (track: AudioTrack): string => {
  if (!track) return '';
  return track.description || track.title || '';
};

/**
 * Format seconds as mm:ss
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

/**
 * Normalize an audio track to ensure it has all required fields
 */
export const normalizeAudioTrack = (track: Partial<AudioTrack>): AudioTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: track.title || 'Unknown Track',
    artist: track.artist || 'Unknown Artist',
    url: track.url || '',
    duration: track.duration || 0,
    coverUrl: track.coverUrl || '/images/default-audio-cover.jpg'
  };
};

export default {
  getAudioUrl,
  getAudioDescription,
  formatDuration,
  normalizeAudioTrack
};
