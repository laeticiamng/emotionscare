
import { Challenge, Badge } from '@/types/challenge';

export const getChallenges = async (userId: string): Promise<Challenge[]> => {
  // Mock implementation - fetching challenges for a specific user
  return [
    {
      id: '1',
      name: 'Journal quotidien',
      title: 'Journal quotidien',
      description: 'Enregistrer une émotion chaque jour pendant 7 jours',
      points: 50,
      status: 'active',
      progress: 3,
      category: 'daily',
      completed: false,
      unlocked: true,
      reward: {
        id: 'badge1',
        name: 'Journaliste émotionnel',
        description: 'A enregistré des émotions pendant 7 jours consécutifs'
      } as Badge
    },
    {
      id: '2',
      name: 'Méditation matinale',
      title: 'Méditation matinale',
      description: 'Compléter 5 sessions de méditation',
      points: 75,
      status: 'active',
      progress: 2,
      category: 'mindfulness',
      completed: false,
      unlocked: true,
      reward: {
        id: 'badge2',
        name: 'Esprit zen',
        description: 'A complété 5 sessions de méditation'
      } as Badge
    }
  ];
};

export const updateChallenge = async (
  challengeId: string, 
  data: { status?: string; progress?: number }
): Promise<boolean> => {
  console.log(`Updating challenge ${challengeId} with data:`, data);
  // Mock successful update
  return true;
};

export const completeChallenge = async (
  challengeId: string
): Promise<{ success: boolean; badge?: Badge }> => {
  console.log(`Completing challenge ${challengeId}`);
  // Mock successful completion
  return {
    success: true,
    badge: {
      id: 'new-badge-1',
      name: 'Champion du défi',
      description: 'A complété un défi avec succès',
      imageUrl: '/badges/challenge-complete.png',
      unlocked: true,
      category: 'achievement'
    }
  };
};
