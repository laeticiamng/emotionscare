
// Define primary emotions
export const primaryEmotions = [
  'joy',
  'sadness',
  'anger',
  'fear',
  'surprise',
  'disgust',
  'neutral',
  'calm',
  'anxiety',
  'excitement',
  'contentment',
  'confusion'
];

// Map of emotions to colors
export const emotionColors: Record<string, string> = {
  joy: '#FFD700',
  happiness: '#FFD700',
  sadness: '#4682B4',
  anger: '#FF4500',
  fear: '#800080',
  surprise: '#00CED1',
  disgust: '#228B22',
  neutral: '#A9A9A9',
  calm: '#87CEEB',
  anxiety: '#FF6347',
  stress: '#FF6347',
  excitement: '#FF69B4',
  contentment: '#98FB98',
  confusion: '#DDA0DD'
};

/**
 * Get color code for an emotion
 */
export function getEmotionColor(emotion: string): string {
  const normalizedEmotion = emotion.toLowerCase();
  return emotionColors[normalizedEmotion] || '#A9A9A9'; // Default to gray
}

/**
 * Get intensity level description based on score
 */
export function getEmotionIntensity(score: number): string {
  if (score >= 0.8) return 'Très élevé';
  if (score >= 0.6) return 'Élevé';
  if (score >= 0.4) return 'Modéré';
  if (score >= 0.2) return 'Faible';
  return 'Très faible';
}
