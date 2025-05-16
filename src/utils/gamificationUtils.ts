
/**
 * Returns a color based on challenge category
 */
export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'daily':
      return 'text-blue-500';
    case 'weekly':
      return 'text-green-500';
    case 'mental':
      return 'text-purple-500';
    case 'physical':
      return 'text-orange-500';
    case 'social':
      return 'text-pink-500';
    case 'emotional':
      return 'text-indigo-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Returns a Tailwind background color class based on badge rarity
 */
export const getBadgeRarityColor = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'bg-slate-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-amber-500';
    default:
      return 'bg-slate-500';
  }
};

/**
 * Returns a formatted string for challenge status
 */
export const getFormattedChallengeStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'En cours';
    case 'completed':
      return 'Terminé';
    case 'failed':
      return 'Échoué';
    case 'locked':
      return 'Verrouillé';
    default:
      return 'Inconnu';
  }
};
