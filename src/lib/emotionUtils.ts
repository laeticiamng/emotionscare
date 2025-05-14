
import { EmotionResult } from '@/types';

// Get a color based on emotion type
export const getEmotionColor = (emotion: string): string => {
  const emotionMap: Record<string, string> = {
    joy: '#FFD700',
    happiness: '#FFD700',
    sadness: '#6495ED',
    anger: '#FF4500',
    fear: '#9370DB',
    disgust: '#8FBC8F',
    surprise: '#FF69B4',
    neutral: '#A9A9A9',
    calm: '#87CEEB',
    anxiety: '#DA70D6',
    stress: '#FA8072',
    excitement: '#FFA500',
    depression: '#4682B4',
    confusion: '#DDA0DD'
  };

  return emotionMap[emotion.toLowerCase()] || '#A9A9A9';
};

// Get an icon for a specific emotion
export const getEmotionIcon = (emotion: string): string => {
  const emotionIconMap: Record<string, string> = {
    joy: '😊',
    happiness: '😃',
    sadness: '😢',
    anger: '😠',
    fear: '😨',
    disgust: '🤢',
    surprise: '😲',
    neutral: '😐',
    calm: '😌',
    anxiety: '😰',
    stress: '😓',
    excitement: '😃',
    depression: '😞',
    confusion: '🤔'
  };

  return emotionIconMap[emotion.toLowerCase()] || '😐';
};

// Get intensity description
export const getIntensityDescription = (intensity: number): string => {
  if (intensity >= 90) return 'Très fort';
  if (intensity >= 70) return 'Fort';
  if (intensity >= 50) return 'Modéré';
  if (intensity >= 30) return 'Léger';
  return 'Très léger';
};

// Format emotion result for display
export const formatEmotionResult = (result: EmotionResult) => {
  return {
    ...result,
    formattedDate: result.date ? new Date(result.date).toLocaleDateString() : 'N/A',
    intensityDescription: getIntensityDescription(result.intensity || result.score || 0),
    color: getEmotionColor(result.emotion || 'neutral'),
    icon: getEmotionIcon(result.emotion || 'neutral')
  };
};

// Group emotions by category
export const categorizeEmotions = (emotions: EmotionResult[]) => {
  return emotions.reduce((acc, emotion) => {
    const category = emotion.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(emotion);
    return acc;
  }, {} as Record<string, EmotionResult[]>);
};

export default {
  getEmotionColor,
  getEmotionIcon,
  getIntensityDescription,
  formatEmotionResult,
  categorizeEmotions
};
