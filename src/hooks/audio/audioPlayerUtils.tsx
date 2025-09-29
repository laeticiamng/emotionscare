
/**
 * Format time in seconds to MM:SS display format
 */
export const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Handle errors when attempting to play audio
 */
export const handlePlayError = (error: Error, onError: (error: Error) => void): void => {
  console.error("Erreur de lecture audio:", error);
  onError(error);
};

/**
 * Get the audio URL from a track object
 */
export const getTrackAudioUrl = (track: any): string | null => {
  if (!track) return null;
  
  // Try to find a valid URL from common properties
  return track.url || track.audioUrl || null;
};
