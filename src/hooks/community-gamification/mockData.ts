
import { Badge, Challenge } from '@/types/gamification';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Première connexion',
    description: 'S\'est connecté pour la première fois',
    imageUrl: '/badges/first-login.png',
    level: 'bronze'
  },
  {
    id: '2',
    name: 'Explorateur émotionnel',
    description: 'A fait 5 scans émotionnels',
    imageUrl: '/badges/emotional-explorer.png',
    level: 'silver'
  },
  {
    id: '3',
    name: 'Maître Zen',
    description: 'A maintenu un équilibre émotionnel pendant 7 jours',
    imageUrl: '/badges/zen-master.png',
    level: 'gold'
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: 'Faire 3 scans émotionnels',
    title: 'Faire 3 scans émotionnels',
    description: 'Effectuez 3 scans émotionnels cette semaine',
    points: 50,
    status: 'ongoing',
    progress: 66,
    startDate: '2025-05-10',
    endDate: '2025-05-17',
    total: 3
  },
  {
    id: '2',
    name: 'Méditer 5 minutes',
    title: 'Méditer 5 minutes', 
    description: 'Méditez pendant au moins 5 minutes',
    points: 30,
    status: 'active',
    progress: 0,
    total: 5
  },
  {
    id: '3',
    name: 'Partager votre humeur',
    title: 'Partager votre humeur',
    description: 'Partagez votre humeur avec un collègue',
    points: 25,
    status: 'available',
    progress: 0,
    total: 1
  },
  {
    id: '4',
    name: 'Écouter de la musique relaxante',
    title: 'Écouter de la musique relaxante',
    description: 'Écoutez au moins 10 minutes de musique relaxante',
    points: 20,
    status: 'active',
    progress: 30,
    total: 10
  },
  {
    id: '5',
    name: 'Enregistrer une gratitude',
    title: 'Enregistrer une gratitude',
    description: 'Notez quelque chose pour lequel vous êtes reconnaissant aujourd\'hui',
    points: 15,
    status: 'active',
    progress: 0,
    total: 1
  },
  {
    id: '6',
    name: 'Faire une pause',
    title: 'Faire une pause',
    description: 'Prenez une pause de 5 minutes loin de votre écran',
    points: 10,
    status: 'available',
    progress: 0,
    total: 1
  },
  {
    id: '7',
    name: 'Respiration profonde',
    title: 'Respiration profonde',
    description: 'Pratiquez 10 respirations profondes',
    points: 15,
    status: 'available',
    progress: 0,
    total: 10
  },
  {
    id: '8',
    name: 'Journal émotionnel',
    title: 'Journal émotionnel',
    description: 'Écrivez une entrée dans votre journal émotionnel',
    points: 25,
    status: 'active',
    progress: 0,
    total: 1
  },
  {
    id: '9',
    name: 'Stretch au bureau',
    title: 'Stretch au bureau',
    description: 'Faites quelques étirements à votre bureau',
    points: 20,
    status: 'available',
    progress: 0,
    total: 1
  },
  {
    id: '10',
    name: 'Boire de l\'eau',
    title: 'Boire de l\'eau',
    description: 'Buvez 8 verres d\'eau aujourd\'hui',
    points: 20,
    status: 'available',
    progress: 0,
    total: 8
  }
];

export const mockStats = {
  points: 175,
  level: 2,
  nextLevelPoints: 300,
  badges: mockBadges,
  completedChallenges: 3,
  activeChallenges: 4,
  streakDays: 5,
  progressToNextLevel: 58,
  totalPoints: 175,
  currentLevel: 2,
  badgesCount: 3,
  pointsToNextLevel: 125,
  lastActivityDate: '2025-05-12',
  challenges: mockChallenges,
  recentAchievements: mockBadges.slice(0, 2)
};
