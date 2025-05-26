
export const formatDuration = (duration: number | string): string => {
  if (typeof duration === 'string') {
    return duration;
  }
  
  if (duration < 60) {
    return `${duration} min`;
  }
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  
  return `${duration} min`;
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'facile':
      return 'text-green-600';
    case 'moyen':
      return 'text-yellow-600';
    case 'difficile':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
};
