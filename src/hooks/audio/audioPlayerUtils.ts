
// Utility functions for audio player

/**
 * Format seconds into MM:SS time format
 */
export const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Handle errors during audio playback
 */
export const handlePlayError = (error: any): string => {
  console.error('Audio playback error:', error);
  
  if (error.name === 'NotAllowedError') {
    return 'Permission de lecture audio refusée. Vérifiez vos paramètres de navigateur.';
  } else if (error.name === 'NotSupportedError') {
    return 'Format audio non supporté par votre navigateur.';
  } else if (error.name === 'AbortError') {
    return 'La lecture audio a été interrompue.';
  }
  
  return 'Erreur lors de la lecture audio. Veuillez réessayer.';
};

/**
 * Get the audio URL from a track object
 */
export const getTrackAudioUrl = (track: any): string => {
  if (!track) return '';
  return track.url || track.audioUrl || '';
};
