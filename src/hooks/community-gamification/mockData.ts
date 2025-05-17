
import { Badge, Challenge, LeaderboardEntry } from '@/types/badge';

// Données de classement simulées
export const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah K.',
    avatar: '/images/avatars/avatar-1.jpg',
    points: 2450,
    rank: 1,
    level: 12,
    streak: 28,
    trend: 'up',
    badges: [
      { id: 'badge-1', name: 'Expert en méditation', description: 'Méditation quotidienne pendant 30 jours', imageUrl: '/images/badges/meditation.svg' },
      { id: 'badge-2', name: 'Génie émotionnel', description: 'Analyser 100 émotions', imageUrl: '/images/badges/emotions.svg' }
    ]
  },
  {
    id: '2',
    name: 'Marc D.',
    avatar: '/images/avatars/avatar-2.jpg',
    points: 2100,
    rank: 2,
    level: 10,
    streak: 14,
    trend: 'up',
    badges: [
      { id: 'badge-3', name: 'Journal assidu', description: 'Écrire dans le journal pendant 20 jours consécutifs', imageUrl: '/images/badges/journal.svg' }
    ]
  },
  {
    id: '3',
    name: 'Lucie B.',
    avatar: '/images/avatars/avatar-3.jpg',
    points: 1850,
    rank: 3,
    level: 9,
    streak: 7,
    trend: 'stable',
    badges: []
  },
  // Utilisateurs supplémentaires pour remplir le classement
  { id: '4', name: 'Thomas L.', avatar: '/images/avatars/avatar-4.jpg', points: 1700, rank: 4, level: 8, streak: 5 },
  { id: '5', name: 'Emma V.', avatar: '/images/avatars/avatar-5.jpg', points: 1600, rank: 5, level: 8, streak: 3 }
];

// Badges simulés
export const mockBadges: Badge[] = [
  {
    id: 'badge1',
    name: "Débutant conscient",
    description: "Complétez votre première semaine d'analyse émotionnelle",
    imageUrl: "/images/badges/starter.svg",
    category: "progression",
    level: "débutant",
    unlocked: true,
    unlockedAt: "2023-06-15T10:30:00Z"
  },
  {
    id: 'badge2',
    name: "Maître de la méditation",
    description: "Effectuez 30 sessions de méditation guidée",
    imageUrl: "/images/badges/meditation-master.svg",
    category: "activités",
    level: "intermédiaire",
    unlocked: true,
    unlockedAt: "2023-07-02T16:45:00Z"
  },
  {
    id: 'badge3',
    name: "Équilibre émotionnel",
    description: "Maintenez un état émotionnel équilibré pendant 14 jours",
    imageUrl: "/images/badges/balance.svg",
    category: "bien-être",
    level: "avancé",
    unlocked: false,
    progress: 65,
    threshold: 100
  }
];

// Défis simulés
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: "Journal quotidien",
    name: "Journal quotidien",
    description: "Écrivez dans votre journal émotionnel tous les jours pendant une semaine",
    points: 100,
    status: 'ongoing',
    category: "journal",
    progress: 3,
    goal: 7,
    icon: "book",
    totalSteps: 7
  },
  {
    id: 'challenge2',
    title: "Méditation matinale",
    name: "Méditation matinale",
    description: "Pratiquez la méditation le matin pendant 5 jours d'affilée",
    points: 150,
    status: 'ongoing',
    category: "méditation",
    progress: 2,
    goal: 5,
    icon: "sun",
    totalSteps: 5
  },
  {
    id: 'challenge3',
    title: "Diversité émotionnelle",
    name: "Diversité émotionnelle",
    description: "Identifiez et analysez 10 émotions différentes",
    points: 200,
    status: 'ongoing',
    category: "émotions",
    progress: 6,
    goal: 10,
    icon: "heart",
    totalSteps: 10
  }
];
