
/**
 * Returns a color based on challenge category
 */
export const getCategoryColor = (category: string): string => {
  switch (category?.toLowerCase()) {
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
  switch (rarity?.toLowerCase()) {
    case 'common':
      return 'bg-slate-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-amber-500';
    case 'bronze':
      return 'bg-amber-700';
    case 'silver':
      return 'bg-slate-400';
    case 'gold':
      return 'bg-yellow-400';
    case 'platinum':
      return 'bg-cyan-400';
    default:
      return 'bg-slate-500';
  }
};

/**
 * Returns a formatted string for challenge status
 */
export const getFormattedChallengeStatus = (status: string): string => {
  switch (status?.toLowerCase()) {
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

/**
 * Converts a numeric progress value to a completed/failed status object
 */
export const progressToStatus = (progress: number, threshold: number = 100): { 
  status: 'active' | 'completed' | 'failed',
  completed: boolean, 
  failed: boolean 
} => {
  if (progress >= threshold) {
    return { status: 'completed', completed: true, failed: false };
  } else if (progress < 0) {
    return { status: 'failed', completed: false, failed: true };
  }
  return { status: 'active', completed: false, failed: false };
};

/**
 * Returns a formatted level name based on numeric level
 */
export const getLevelName = (level: number): string => {
  const levelNames = [
    'Débutant',
    'Apprenti',
    'Explorateur',
    'Adepte',
    'Expert',
    'Maître',
    'Virtuose',
    'Sage',
    'Éclairé',
    'Transcendant'
  ];
  
  if (level <= 0) return levelNames[0];
  if (level > levelNames.length) return `${levelNames[levelNames.length - 1]} ${level - levelNames.length + 1}`;
  return levelNames[level - 1];
};
