
import { Challenge } from '@/types/badge';

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
      reward: {}
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
      reward: {}
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
