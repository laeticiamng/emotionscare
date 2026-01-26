// @ts-nocheck


export const getCategoryColor = (category: string): string => {
  const categories: Record<string, string> = {
    'daily': 'text-blue-500',
    'weekly': 'text-green-500',
    'special': 'text-purple-500',
    'journal': 'text-amber-500',
    'mindfulness': 'text-teal-500',
    'physical': 'text-orange-500',
    'emotional': 'text-pink-500',
    'social': 'text-indigo-500',
    'learning': 'text-cyan-500',
    'productivity': 'text-emerald-500',
    'gratitude': 'text-yellow-500',
    'Admin': 'text-red-500',
    'Analytics': 'text-violet-500'
  };

  return categories[category] || 'text-slate-500';
};

export const getBadgeRarityColor = (rarity: string): string => {
  const rarityColors: Record<string, string> = {
    'bronze': 'border-amber-700',
    'silver': 'border-slate-400',
    'gold': 'border-yellow-500',
    'platinum': 'border-blue-400',
    'rare': 'border-purple-500',
    'epic': 'border-fuchsia-600',
    'legendary': 'border-orange-500',
    'common': 'border-slate-500'
  };

  return rarityColors[rarity] || 'border-slate-300';
};
