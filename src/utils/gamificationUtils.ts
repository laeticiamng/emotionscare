
/**
 * Gets the Tailwind CSS color class for a badge rarity
 */
export const getBadgeRarityColor = (rarity: string | undefined): string => {
  if (!rarity) return 'bg-slate-500';
  
  switch (rarity.toLowerCase()) {
    case 'bronze':
      return 'bg-amber-700';
    case 'silver':
      return 'bg-slate-400';
    case 'gold':
      return 'bg-yellow-400';
    case 'platinum':
      return 'bg-blue-300';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-orange-500';
    default:
      return 'bg-slate-500';
  }
};

/**
 * Gets the Tailwind CSS color class for a challenge category
 */
export const getCategoryColor = (category: string | undefined): string => {
  if (!category) return 'text-slate-600';
  
  switch (category.toLowerCase()) {
    case 'daily':
      return 'text-blue-600';
    case 'weekly':
      return 'text-purple-600';
    case 'team':
      return 'text-green-600';
    case 'personal':
      return 'text-amber-600';
    case 'streak':
      return 'text-red-600';
    case 'special':
      return 'text-pink-600';
    default:
      return 'text-slate-600';
  }
};
