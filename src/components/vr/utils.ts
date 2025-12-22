export const formatDuration = (duration: number | string): string => {
  const numDuration = typeof duration === 'string' ? parseInt(duration) : duration;
  return `${numDuration} min`;
};

export const durationToNumber = (duration: number | string): number => {
  return typeof duration === 'string' ? parseInt(duration) : duration;
};

export const getDifficultyClass = (difficulty: string): string => {
  switch (difficulty) {
    case 'Débutant':
    case 'beginner':
    case 'easy':
      return 'text-green-600 bg-green-50';
    case 'Intermédiaire':
    case 'intermediate':
    case 'medium':
      return 'text-orange-600 bg-orange-50';
    case 'Avancé':
    case 'advanced':
    case 'hard':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const normalizeDifficulty = (difficulty: string): 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced' => {
  const map: Record<string, 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced'> = {
    'beginner': 'beginner',
    'Débutant': 'beginner',
    'easy': 'easy',
    'intermediate': 'intermediate',
    'Intermédiaire': 'intermediate',
    'medium': 'medium',
    'advanced': 'advanced',
    'Avancé': 'advanced',
    'hard': 'hard',
  };
  return map[difficulty] || 'medium';
};
