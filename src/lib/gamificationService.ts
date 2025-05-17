
import { Challenge } from '@/hooks/community-gamification/types';

export async function fetchUserChallenges(userId: string): Promise<Challenge[]> {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner des défis simulés
  return [
    {
      id: 'challenge-1',
      title: 'Scan quotidien',
      description: 'Effectuez un scan émotionnel chaque jour pendant une semaine',
      points: 100,
      status: 'ongoing',
      category: 'scan',
      progress: 5,
      goal: 7
    },
    {
      id: 'challenge-2',
      title: 'Explorer la méditation',
      description: 'Participez à 3 sessions de méditation guidée',
      points: 150,
      status: 'active',
      category: 'meditation',
      progress: 1,
      goal: 3
    },
    {
      id: 'challenge-3',
      title: 'Journal émotionnel',
      description: 'Rédigez 5 entrées dans votre journal émotionnel',
      points: 200,
      status: 'completed',
      category: 'journal',
      progress: 5,
      goal: 5
    },
  ];
}

export async function completeChallenge(challengeId: string): Promise<boolean> {
  console.log(`Compléter le défi: ${challengeId}`);
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simuler une réussite
  return true;
}

export async function fetchUserBadges(userId: string): Promise<any[]> {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner des badges simulés
  return [
    {
      id: 'badge-1',
      name: 'Première semaine',
      description: 'A utilisé l\'application pendant une semaine complète',
      icon: 'star',
      unlocked: true,
      progress: 100,
      total: 100
    },
    {
      id: 'badge-2',
      name: 'Maître de la pleine conscience',
      description: 'A complété 10 sessions de méditation',
      icon: 'zap',
      unlocked: false,
      progress: 7,
      total: 10
    },
    {
      id: 'badge-3',
      name: 'Expert en émotions',
      description: 'A identifié 20 émotions différentes',
      icon: 'smile',
      unlocked: false,
      progress: 12,
      total: 20
    }
  ];
}
