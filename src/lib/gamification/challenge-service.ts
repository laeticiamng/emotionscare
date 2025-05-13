
import { Challenge } from '@/types/gamification';

export const getChallenges = async (userId: string): Promise<Challenge[]> => {
  // Mock implementation - fetching challenges for a specific user
  return [
    {
      id: '1',
      title: 'Journal quotidien',
      description: 'Enregistrer une émotion chaque jour pendant 7 jours',
      type: 'streak',
      completed: false,
      progress: 3,
      category: 'daily',
      points: 50,
      status: 'active'
    },
    {
      id: '2',
      title: 'Méditation matinale',
      description: 'Compléter 5 sessions de méditation',
      type: 'completion',
      completed: false,
      progress: 2,
      category: 'mindfulness',
      points: 75,
      status: 'active'
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
