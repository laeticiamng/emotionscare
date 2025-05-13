
import { Badge, Challenge } from '@/types/gamification';

export const getBadges = async (): Promise<Badge[]> => {
  // Mock implementation
  return [
    {
      id: '1',
      name: 'Premier pas',
      description: 'Première émotion enregistrée',
      image: '/badges/first-step.png',
      dateEarned: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Explorateur émotionnel',
      description: '5 émotions différentes enregistrées',
      image: '/badges/explorer.png',
      dateEarned: new Date().toISOString()
    }
  ];
};

export const getChallenges = async (): Promise<Challenge[]> => {
  // Mock implementation
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

export const processEmotionForBadges = async (
  userId: string,
  emotion: string,
  score: number
): Promise<Badge[]> => {
  // In a real app, this would check badge criteria against user history
  // and return any newly earned badges
  
  // Mock implementation - return a random badge occasionally
  if (Math.random() > 0.7) {
    return [
      {
        id: '3',
        name: 'Maître de conscience',
        description: 'Enregistrer 10 émotions',
        image: '/badges/master.png',
        dateEarned: new Date().toISOString()
      }
    ];
  }
  
  return [];
};

export const completeChallenge = async (challengeId: string): Promise<boolean> => {
  // In a real app, this would update the challenge status in the database
  console.log(`Challenge ${challengeId} marked as completed`);
  
  // Mock successful completion
  return true;
};
