
import { Recommendation } from '@/types/recommendation';
import { v4 as uuidv4 } from 'uuid';

export const getRecommendationsForMood = async (mood: string, intensity: number): Promise<Recommendation[]> => {
  // Mock implementation that would be replaced with real API calls
  const recommendations: Recommendation[] = [
    {
      id: uuidv4(),
      title: 'Méditation guidée de 5 minutes',
      description: 'Une courte méditation pour calmer votre esprit et vous recentrer.',
      type: 'mindfulness',
      source: 'mood-api',
      category: 'well-being',
      urgency: 'low'
    },
    {
      id: uuidv4(),
      title: 'Playlist relaxante',
      description: 'Musique apaisante pour vous aider à vous détendre.',
      type: 'music',
      source: 'mood-api',
      category: 'entertainment',
      urgency: 'medium'
    },
    {
      id: uuidv4(),
      title: 'Exercice de respiration profonde',
      description: 'Technique de respiration pour réduire le stress immédiatement.',
      type: 'exercise',
      source: 'mood-api',
      category: 'health',
      urgency: 'high'
    }
  ];

  return recommendations;
};

export const getRecommendationsForEmotionalState = async (userId: string, emotionalState: any): Promise<Recommendation[]> => {
  // Mock implementation
  console.log(`Getting recommendations for user ${userId} with emotional state:`, emotionalState);
  return getRecommendationsForMood(emotionalState.dominantEmotion, emotionalState.intensity);
};

export default {
  getRecommendationsForMood,
  getRecommendationsForEmotionalState
};
