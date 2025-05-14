
import { AlertTriangle, Heart, Coffee, Smile, Frown, Meh, Briefcase, Sun } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

/**
 * Returns the appropriate icon for a given emotion
 * @param emotion The emotion to get an icon for
 * @returns A Lucide icon component
 */
export const getEmotionIcon = (emotion: string | undefined): LucideIcon => {
  if (!emotion) return Meh;
  
  const lowercaseEmotion = emotion.toLowerCase();
  
  switch (lowercaseEmotion) {
    case 'joy':
    case 'happy':
    case 'happiness':
      return Smile;
    case 'sadness':
    case 'sad':
      return Frown;
    case 'anger':
    case 'angry':
      return AlertTriangle;
    case 'love':
      return Heart;
    case 'calm':
    case 'relaxed':
      return Coffee;
    case 'motivated':
    case 'productive':
      return Briefcase;
    case 'optimistic':
      return Sun;
    default:
      return Meh;
  }
};

/**
 * Returns a color for a given emotion
 * @param emotion The emotion to get a color for
 * @returns A color string (e.g. text-blue-500)
 */
export const getEmotionColor = (emotion: string | undefined): string => {
  if (!emotion) return 'text-gray-400';
  
  const lowercaseEmotion = emotion.toLowerCase();
  
  switch (lowercaseEmotion) {
    case 'joy':
    case 'happy':
    case 'happiness':
      return 'text-yellow-500';
    case 'sadness':
    case 'sad':
      return 'text-blue-500';
    case 'anger':
    case 'angry':
      return 'text-red-500';
    case 'fear':
      return 'text-purple-500';
    case 'love':
      return 'text-pink-500';
    case 'calm':
    case 'relaxed':
      return 'text-green-500';
    case 'motivated':
    case 'productive':
      return 'text-orange-500';
    case 'optimistic':
      return 'text-amber-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Get an emotion description
 * @param emotion The emotion to describe
 * @returns A short description of the emotion
 */
export const getEmotionDescription = (emotion: string | undefined): string => {
  if (!emotion) return 'État émotionnel indéterminé';
  
  const lowercaseEmotion = emotion.toLowerCase();
  
  switch (lowercaseEmotion) {
    case 'joy':
    case 'happy':
    case 'happiness':
      return 'Sensation de bonheur et de plaisir';
    case 'sadness':
    case 'sad':
      return 'Sentiment de tristesse ou de mélancolie';
    case 'anger':
    case 'angry':
      return 'Émotion d\'irritation ou de colère';
    case 'fear':
      return 'Sentiment d\'inquiétude ou d\'appréhension';
    case 'love':
      return 'Sentiment d\'affection ou d\'attachement';
    case 'calm':
    case 'relaxed':
      return 'État de tranquillité et de détente';
    case 'motivated':
    case 'productive':
      return 'Sensation d\'énergie et de détermination';
    case 'optimistic':
      return 'Vision positive de l\'avenir';
    default:
      return `État émotionnel: ${emotion}`;
  }
};

export const getIntensityLabel = (intensity: number): string => {
  if (intensity >= 90) return 'Très intense';
  if (intensity >= 70) return 'Intense';
  if (intensity >= 50) return 'Modéré';
  if (intensity >= 30) return 'Léger';
  return 'Très léger';
};
