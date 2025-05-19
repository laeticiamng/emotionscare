
import { Badge, Challenge } from '@/types/badge';

// Fonction pour récupérer tous les défis de l'utilisateur
export const fetchUserChallenges = async (userId: string): Promise<Challenge[]> => {
  // C'est juste une implémentation simulée
  return [
    {
      id: '1',
      title: 'Apprenti émotionnel',
      description: 'Enregistrer 5 émotions différentes',
      points: 50,
      status: 'active',
      category: 'emotions',
      progress: 3,
      goal: 5,
      unlocked: true,
      reward: {
        id: 'badge1',
        name: 'Explorateur émotionnel',
        description: 'A enregistré 5 émotions différentes',
        imageUrl: '/badges/emotional-explorer.png'
      } as Badge
    },
    {
      id: '2',
      title: 'Explorateur de conscience',
      description: 'Compléter 3 sessions de méditation guidée',
      points: 100,
      status: 'active',
      category: 'meditation',
      progress: 1,
      goal: 3,
      unlocked: true,
      reward: {
        id: 'badge2',
        name: 'Méditant novice',
        description: 'A complété 3 sessions de méditation guidée',
        imageUrl: '/badges/meditation-novice.png'
      } as Badge
    },
    {
      id: '3',
      title: 'Journal intime',
      description: 'Écrire dans votre journal 7 jours consécutifs',
      points: 150,
      status: 'locked',
      category: 'journal',
      progress: 0,
      goal: 7,
      unlocked: false,
      reward: {
        id: 'badge3',
        name: 'Journal régulier',
        description: 'A écrit dans son journal pendant 7 jours consécutifs',
        imageUrl: '/badges/consistent-journaler.png'
      } as Badge
    }
  ];
};

// Fonction pour récupérer les badges utilisateur
export const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  // Implémentation simulée
  return [
    {
      id: 'badge1',
      name: 'Premier pas',
      description: 'Première connexion à l\'application',
      imageUrl: '/badges/first-login.png',
      unlocked: true,
      category: 'system'
    },
    {
      id: 'badge2',
      name: 'Explorateur émotionnel',
      description: 'Explorer 5 émotions différentes',
      imageUrl: '/badges/emotion-explorer.png',
      progress: 3,
      threshold: 5,
      unlocked: false,
      category: 'emotions'
    }
  ];
};

// Fonction pour compléter un défi
export const completeChallenge = async (
  challengeId: string
): Promise<{ success: boolean; badge?: Badge }> => {
  console.log(`Completing challenge ${challengeId}`);
  
  return {
    success: true,
    badge: {
      id: 'new-badge',
      name: 'Champion du défi',
      description: 'Un défi relevé avec succès',
      imageUrl: '/badges/challenge-completed.png',
      unlocked: true,
      category: 'achievements'
    }
  };
};
