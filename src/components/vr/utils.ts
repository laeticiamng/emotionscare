// @ts-nocheck

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
      return 'text-green-600 bg-green-50';
    case 'Intermédiaire':
      return 'text-orange-600 bg-orange-50';
    case 'Avancé':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};
