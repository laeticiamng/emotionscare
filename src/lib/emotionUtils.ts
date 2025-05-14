
import { EmotionResult } from '@/types';

export const formatEmotionScore = (score: number | undefined): string => {
  if (score === undefined) return 'N/A';
  return `${Math.round(score * 100)}%`;
};

export const getEmotionColor = (emotion: string): string => {
  const emotionColors: Record<string, string> = {
    joy: '#FFD700',
    happiness: '#FFD700',
    calm: '#90EE90',
    surprise: '#87CEFA',
    fear: '#9370DB',
    anxiety: '#9370DB',
    stress: '#FF6347',
    anger: '#FF4500',
    sadness: '#4682B4',
    neutral: '#A9A9A9',
    disgust: '#8B008B',
    contentment: '#98FB98',
    excitement: '#FFA500',
    hopeful: '#00CED1',
    grateful: '#BA55D3',
    proud: '#FF69B4',
    confident: '#1E90FF',
    loved: '#FF1493',
    optimistic: '#FFB6C1',
    worried: '#6495ED',
    frustrated: '#DC143C',
    disappointed: '#708090',
    overwhelmed: '#800000',
    confused: '#9932CC',
    bored: '#BDB76B'
  };

  return emotionColors[emotion.toLowerCase()] || '#A9A9A9';
};

export const getEmotionEmoji = (emotion: string): string => {
  const emotionEmojis: Record<string, string> = {
    joy: '😊',
    happiness: '😄',
    calm: '😌',
    surprise: '😮',
    fear: '😨',
    anxiety: '😰',
    stress: '😓',
    anger: '😠',
    sadness: '😢',
    neutral: '😐',
    disgust: '🤢',
    contentment: '☺️',
    excitement: '🤩',
    hopeful: '🙏',
    grateful: '🙌',
    proud: '😎',
    confident: '💪',
    loved: '❤️',
    optimistic: '👍',
    worried: '😟',
    frustrated: '😤',
    disappointed: '😞',
    overwhelmed: '😩',
    confused: '😕',
    bored: '🥱'
  };

  return emotionEmojis[emotion.toLowerCase()] || '❓';
};

export const createEmptyEmotionResult = (): EmotionResult => ({
  id: '',
  emotion: 'neutral',
  score: 0,
  confidence: 0,
  date: null,
  text: ''
});

export const analyzeEmotionTrend = (emotions: EmotionResult[], days: number = 7) => {
  if (!emotions || emotions.length < 2) return { trend: 'stable', direction: 0 };
  
  const recentEmotions = emotions.slice(0, days);
  const positiveEmotions = ['joy', 'happiness', 'calm', 'contentment', 'hopeful', 'grateful', 'proud', 'confident', 'loved', 'optimistic'];
  const negativeEmotions = ['fear', 'anxiety', 'stress', 'anger', 'sadness', 'disgust', 'worried', 'frustrated', 'disappointed', 'overwhelmed', 'confused'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  recentEmotions.forEach(item => {
    if (positiveEmotions.includes(item.emotion.toLowerCase())) {
      positiveCount++;
    } else if (negativeEmotions.includes(item.emotion.toLowerCase())) {
      negativeCount++;
    }
  });
  
  const direction = positiveCount - negativeCount;
  let trend = 'stable';
  
  if (direction > 1) {
    trend = 'improving';
  } else if (direction < -1) {
    trend = 'declining';
  }
  
  return { trend, direction };
};
