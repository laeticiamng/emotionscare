
import { Challenge, Badge } from '@/types/challenge';

export const mockCommunityBadges: Badge[] = [
  {
    id: "community-1",
    name: "Communauté active",
    description: "Participer à 5 discussions communautaires",
    imageUrl: "/badges/community-active.png",
    category: "community",
    tier: "bronze",
    unlocked: false,
    progress: 2,
    threshold: 5
  },
  {
    id: "community-2",
    name: "Supporter bienveillant",
    description: "Aider 3 membres de la communauté",
    imageUrl: "/badges/community-support.png",
    category: "community",
    tier: "silver",
    unlocked: false,
    progress: 1,
    threshold: 3
  },
  {
    id: "community-3",
    name: "Créateur de contenu",
    description: "Partager 5 articles avec la communauté",
    imageUrl: "/badges/content-creator.png",
    category: "community",
    tier: "gold",
    unlocked: false,
    progress: 0,
    threshold: 5
  }
];

export const mockCommunityChallenges: Challenge[] = [
  {
    id: "cc-1",
    name: "Échange positif",
    title: "Échange positif",
    description: "Participer à 3 discussions positives dans la communauté",
    points: 50,
    status: "active",
    progress: 1,
    category: "community",
    unlocked: true,
    goal: 3,
    difficulty: "beginner",
    icon: "message-circle"
  },
  {
    id: "cc-2",
    name: "Connexion sociale",
    title: "Connexion sociale",
    description: "Se connecter avec 5 nouveaux membres de la communauté",
    points: 75,
    status: "active",
    progress: 2,
    category: "community",
    unlocked: true,
    goal: 5,
    difficulty: "intermediate",
    icon: "users"
  },
  {
    id: "cc-3",
    name: "Champion de la communauté",
    title: "Champion de la communauté",
    description: "Résoudre un problème communautaire ou répondre à 10 questions",
    points: 100,
    status: "active",
    progress: 3,
    category: "community",
    unlocked: true,
    goal: 10,
    difficulty: "advanced",
    icon: "award"
  }
];
