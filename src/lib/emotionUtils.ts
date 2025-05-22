
export const getEmotionIcon = (emotion: string | undefined): string => {
  if (!emotion) return '😐';
  
  switch (emotion.toLowerCase()) {
    case 'happy':
    case 'joy':
      return '😊';
    case 'excited':
      return '🤩';
    case 'calm':
    case 'relaxed':
      return '😌';
    case 'sad':
      return '😔';
    case 'angry':
      return '😡';
    case 'stressed':
      return '😰';
    case 'anxious':
      return '😨';
    case 'tired':
      return '😴';
    case 'bored':
      return '😒';
    default:
      return '😐';
  }
};

export const getEmotionColor = (emotion: string | undefined): string => {
  if (!emotion) return '';
  
  switch (emotion.toLowerCase()) {
    case 'happy':
    case 'joy':
    case 'excited':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'calm':
    case 'relaxed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'sad':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'angry':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'stressed':
    case 'anxious':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'tired':
    case 'bored':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};
