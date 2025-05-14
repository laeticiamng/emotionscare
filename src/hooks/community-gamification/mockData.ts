
import { Challenge } from './types';
import { Badge } from '@/types/gamification';

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Scanner chaque jour',
    description: 'Effectuez un scan émotionnel chaque jour pendant 5 jours consécutifs',
    points: 100,
    status: 'ongoing',
    category: 'scan',
    progress: 3,
    goal: 5,
    icon: 'BarChart2'
  },
  {
    id: '2',
    title: 'Journal introspectif',
    description: 'Écrivez au moins 3 entrées dans votre journal cette semaine',
    points: 75,
    status: 'ongoing',
    category: 'journal',
    progress: 1,
    goal: 3,
    icon: 'Book'
  },
  {
    id: '3',
    title: 'Méditation quotidienne',
    description: 'Complétez une session VR de méditation chaque jour pendant 3 jours',
    points: 150,
    status: 'locked',
    category: 'vr',
    progress: 0,
    goal: 3,
    icon: 'Cloud'
  },
  {
    id: '4',
    title: 'Connectez-vous à votre coach',
    description: 'Ayez une conversation avec votre coach IA',
    points: 50,
    status: 'completed',
    category: 'coach',
    progress: 1,
    goal: 1,
    icon: 'MessageSquare'
  }
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier Pas',
    description: 'Vous avez effectué votre premier scan émotionnel',
    image_url: '/badges/first-scan.svg',
    type: 'achievement',
    level: 'Bronze'
  },
  {
    id: '2',
    name: 'Introspection',
    description: 'Vous avez écrit 5 entrées dans votre journal',
    image_url: '/badges/journal-5.svg',
    type: 'milestone',
    level: 'Silver'
  },
  {
    id: '3',
    name: 'Explorateur VR',
    description: 'Vous avez essayé toutes les expériences VR disponibles',
    image_url: '/badges/vr-explorer.svg',
    type: 'completion',
    level: 'Gold'
  }
];
