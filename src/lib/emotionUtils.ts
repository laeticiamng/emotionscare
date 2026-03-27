// @ts-nocheck
export const getEmotionIcon = (emotion: string | undefined): string => {
  if (!emotion) return '😐';
  
  switch (emotion.toLowerCase()) {
    case 'happy':
    case 'joy':
      return '😊';
    case 'excited':
      return '🤩';
    case 'calm':
      return '😌';
    case 'relaxed':
      return '😊';
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
    case 'neutral':
      return '😐';
    case 'proud':
      return '🥳';
    case 'grateful':
      return '🙏';
    case 'content':
      return '☺️';
    default:
      return '😐';
  }
};

export const getEmotionColor = (emotion: string | undefined): string => {
  if (!emotion) return '';
  
  switch (emotion.toLowerCase()) {
    case 'happy':
    case 'joy':
    case 'content':
    case 'grateful':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'excited':
    case 'proud':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
    case 'calm':
    case 'relaxed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    case 'sad':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300';
    case 'angry':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    case 'stressed':
    case 'anxious':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
    case 'tired':
    case 'bored':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
    case 'neutral':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
  }
};

export const getEmotionGradient = (emotion: string | undefined): string => {
  if (!emotion) return 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700';
  
  switch (emotion.toLowerCase()) {
    case 'happy':
    case 'joy':
    case 'content':
    case 'grateful':
      return 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/40';
    case 'excited':
    case 'proud':
      return 'from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/40';
    case 'calm':
    case 'relaxed':
      return 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/40';
    case 'sad':
      return 'from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/40';
    case 'angry':
      return 'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/40';
    case 'stressed':
    case 'anxious':
      return 'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/40';
    case 'tired':
    case 'bored':
      return 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/40';
    default:
      return 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700';
  }
};

// Get intensity-based descriptions for each emotion
export const getEmotionIntensityDescription = (emotion: string, intensity: number = 3): string => {
  const intensityMap: Record<string, string[]> = {
    joy: ['légèrement joyeux', 'joyeux', 'très joyeux', 'extrêmement joyeux', 'euphorique'],
    happy: ['légèrement heureux', 'heureux', 'très heureux', 'extrêmement heureux', 'extatique'],
    excited: ['un peu excité', 'excité', 'très excité', 'extrêmement excité', 'surexcité'],
    calm: ['un peu calme', 'calme', 'très calme', 'extrêmement calme', 'serein'],
    relaxed: ['un peu détendu', 'détendu', 'très détendu', 'extrêmement détendu', 'paisible'],
    neutral: ['plutôt neutre', 'neutre', 'complètement neutre', 'détaché', 'indifférent'],
    sad: ['un peu triste', 'triste', 'très triste', 'extrêmement triste', 'désespéré'],
    angry: ['irrité', 'en colère', 'très en colère', 'furieux', 'enragé'],
    stressed: ['un peu stressé', 'stressé', 'très stressé', 'extrêmement stressé', 'paniqué'],
    anxious: ['un peu anxieux', 'anxieux', 'très anxieux', 'extrêmement anxieux', 'paralysé par l\'anxiété'],
    tired: ['un peu fatigué', 'fatigué', 'très fatigué', 'extrêmement fatigué', 'épuisé'],
    bored: ['un peu ennuyé', 'ennuyé', 'très ennuyé', 'extrêmement ennuyé', 'complètement désintéressé'],
    proud: ['un peu fier', 'fier', 'très fier', 'extrêmement fier', 'débordant de fierté'],
  };

  // Ensure intensity is within range 1-5
  const safeIntensity = Math.max(1, Math.min(5, intensity));
  
  // Get descriptions for this emotion or return a default
  const descriptions = intensityMap[emotion.toLowerCase()] || ['peu intense', 'modéré', 'assez intense', 'intense', 'extrêmement intense'];
  
  // Return the description for this intensity (0-indexed array)
  return descriptions[safeIntensity - 1];
};
