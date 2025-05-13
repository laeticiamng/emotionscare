
import { EmotionResult } from '@/types';
import { Badge } from '@/types/gamification';

/**
 * Process an emotion result to potentially award badges
 * @param emotionResult The emotion scan result
 * @returns Array of any badges earned
 */
export async function processEmotionForBadges(emotionResult: EmotionResult): Promise<Badge[]> {
  // In a real implementation, this would call an API
  // For now, we'll simulate some badge awards based on the emotion
  
  const earnedBadges: Badge[] = [];
  
  if (emotionResult.emotion === 'happy' && emotionResult.score && emotionResult.score > 80) {
    earnedBadges.push({
      id: 'happiness-master',
      name: 'Maître du bonheur',
      description: 'Atteindre un niveau élevé de bonheur',
      image: '/badges/happiness.svg',
      dateEarned: new Date().toISOString()
    });
  }
  
  if (emotionResult.text && emotionResult.text.length > 100) {
    earnedBadges.push({
      id: 'expressive-soul',
      name: 'Âme expressive',
      description: 'Partager ses émotions de manière détaillée',
      image: '/badges/expression.svg',
      dateEarned: new Date().toISOString()
    });
  }
  
  return earnedBadges;
}

/**
 * Update user stats based on activity
 * @param activityType Type of activity performed
 * @returns Updated user stats
 */
export async function updateUserStats(activityType: string): Promise<any> {
  // In a real implementation, this would call an API
  // For now, we'll just return a mock response
  return {
    pointsEarned: 10,
    newLevel: false,
    currentStats: {
      level: 5,
      points: 450,
      nextLevelPoints: 500
    }
  };
}
