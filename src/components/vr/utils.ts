
/**
 * VR Session Utilities
 * Helper functions for VR session components
 */

import { VRSessionTemplate, VRSession } from '@/types/vr';

// Convert any duration to number (for calculations)
export const durationToNumber = (duration: string | number | undefined): number => {
  if (typeof duration === 'undefined') {
    return 0;
  }
  
  if (typeof duration === 'number') {
    return duration;
  }
  
  // Try to parse string to number
  const parsed = parseFloat(duration);
  return isNaN(parsed) ? 0 : parsed;
};

// Format a duration (in minutes) to display format
export const formatDuration = (duration: string | number | undefined): string => {
  const minutes = durationToNumber(duration);
  
  if (minutes < 1) {
    return 'Less than a minute';
  }
  
  if (minutes === 1) {
    return '1 minute';
  }
  
  return `${Math.round(minutes)} minutes`;
};

// Get difficult level class
export const getDifficultyClass = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
    case 'easy':
    case 'débutant':
    case 'facile':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
    case 'medium':
    case 'intermédiaire':
    case 'moyen':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
    case 'hard':
    case 'avancé':
    case 'difficile':
      return 'bg-purple-100 text-purple-800';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Calculate progress percentage of a session
export const calculateSessionProgress = (session: VRSession, template?: VRSessionTemplate): number => {
  if (!session) {
    return 0;
  }
  
  // If session is completed, return 100%
  if (session.completed) {
    return 100;
  }
  
  // If we have start and end time, calculate percentage
  if (session.startTime && session.endTime) {
    const startTime = new Date(session.startTime).getTime();
    const endTime = new Date(session.endTime).getTime();
    const duration = endTime - startTime;
    
    if (duration <= 0) {
      return 0;
    }
    
    const elapsed = Date.now() - startTime;
    return Math.min(100, Math.round((elapsed / duration) * 100));
  }
  
  // If we have duration from the template, calculate based on elapsed time
  if (template && template.duration) {
    const startTime = new Date(session.startTime).getTime();
    const elapsed = Date.now() - startTime;
    const duration = durationToNumber(template.duration) * 60 * 1000; // convert minutes to ms
    
    return Math.min(100, Math.round((elapsed / duration) * 100));
  }
  
  // Default to 0
  return 0;
};
