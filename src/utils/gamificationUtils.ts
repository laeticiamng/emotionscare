
import { Challenge } from '@/types/gamification';

/**
 * Get color for a challenge category
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'daily': 'bg-blue-600',
    'weekly': 'bg-green-600',
    'monthly': 'bg-purple-600',
    'special': 'bg-amber-600',
    'fitness': 'bg-red-600',
    'mindfulness': 'bg-teal-600',
    'social': 'bg-indigo-600',
    'learning': 'bg-orange-600'
  };

  return colors[category.toLowerCase()] || 'bg-gray-600';
};

/**
 * Get a complete challenge object with a boolean return
 */
export const completeChallenge = async (id: string): Promise<boolean> => {
  try {
    // Mock implementation - in a real app this would call an API
    console.log(`Completing challenge ${id}`);
    return true;
  } catch (error) {
    console.error('Error completing challenge:', error);
    return false;
  }
};
