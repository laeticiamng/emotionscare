
import { VRDifficulty } from '@/types/vr';

/**
 * Extracts YouTube video ID from different URL formats
 */
export const extractYoutubeID = (url: string): string | null => {
  if (!url) return null;
  
  // Regular expression to match YouTube URL patterns
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  
  return match ? match[1] : null;
};

/**
 * Normalize difficulty level to standard format
 */
export const normalizeDifficulty = (difficulty: string | undefined): VRDifficulty => {
  if (!difficulty) return 'beginner';
  
  const normalized = difficulty.toLowerCase();
  
  if (normalized.includes('begin') || normalized.includes('easy') || normalized.includes('débutant')) {
    return 'beginner';
  } else if (normalized.includes('inter') || normalized.includes('medium') || normalized.includes('modéré')) {
    return 'intermediate';
  } else if (normalized.includes('advan') || normalized.includes('hard') || normalized.includes('avancé')) {
    return 'advanced';
  } else if (normalized.includes('expert') || normalized.includes('master')) {
    return 'expert';
  }
  
  return 'beginner';
};

/**
 * Format duration in minutes to readable format
 */
export const formatVRDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}min` 
      : `${hours}h`;
  }
};

/**
 * Get color based on difficulty level
 */
export const getDifficultyColor = (difficulty: string): string => {
  const normalized = normalizeDifficulty(difficulty);
  
  switch (normalized) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-blue-500';
    case 'advanced':
      return 'bg-purple-500';
    case 'expert':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
