
export const formatDuration = (duration: number | string): string => {
  const numDuration = typeof duration === 'string' ? parseInt(duration) : duration;
  
  if (isNaN(numDuration)) return '0 min';
  
  if (numDuration < 60) {
    return `${numDuration} min`;
  }
  
  const hours = Math.floor(numDuration / 60);
  const minutes = numDuration % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}min`;
};

export const durationToNumber = (duration: number | string): number => {
  if (typeof duration === 'number') return duration;
  
  const numDuration = parseInt(duration);
  return isNaN(numDuration) ? 0 : numDuration;
};

export const getEmotionColor = (emotion: string): string => {
  const emotionColors: Record<string, string> = {
    calm: '#10b981',
    peaceful: '#06b6d4',
    focused: '#8b5cf6',
    energized: '#f59e0b',
    relaxed: '#84cc16',
    stressed: '#ef4444',
    anxious: '#f97316',
    happy: '#eab308',
    sad: '#6366f1',
    angry: '#dc2626',
  };
  
  return emotionColors[emotion.toLowerCase()] || '#6b7280';
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'débutant':
      return '#10b981';
    case 'intermédiaire':
      return '#f59e0b';
    case 'avancé':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'meditation':
      return '🧘';
    case 'relaxation':
      return '🌿';
    case 'focus':
      return '🎯';
    case 'therapy':
      return '💆';
    default:
      return '🎮';
  }
};
