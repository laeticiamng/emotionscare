
import { Challenge, LeaderboardEntry } from '@/types/challenge';
import { Badge } from '@/types/badge';

export const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Premier pas",
    name: "first-steps",
    description: "Complétez votre premier scan émotionnel",
    progress: 100,
    completed: true,
    status: "completed",
    points: 10,
    difficulty: "easy",
    category: "débutant",
    tags: ["émotion", "débutant"],
    goal: "1",
    totalSteps: 1
  },
  {
    id: "2",
    title: "Explorateur émotionnel",
    name: "emotion-explorer",
    description: "Réalisez 5 scans émotionnels différents",
    progress: 60,
    completed: false,
    status: "in-progress",
    points: 25,
    difficulty: "medium",
    category: "émotion",
    tags: ["émotion", "exploration"],
    goal: "5",
    totalSteps: 5
  },
  {
    id: "3",
    title: "Journal assidu",
    name: "journal-keeper",
    description: "Complétez des entrées de journal pendant 7 jours consécutifs",
    progress: 42,
    completed: false,
    status: "in-progress",
    points: 50,
    difficulty: "hard",
    category: "journal",
    tags: ["journal", "constance"],
    goal: "7",
    totalSteps: 7
  },
  {
    id: "4",
    title: "Maître du calme",
    name: "calm-master",
    description: "Atteignez un niveau de sérénité de 80% ou plus 3 fois",
    progress: 33,
    completed: false,
    status: "in-progress",
    points: 30,
    difficulty: "medium",
    category: "bien-être",
    tags: ["calme", "méditation"],
    goal: "3",
    totalSteps: 3
  },
  {
    id: "5",
    title: "Musicien de l'âme",
    name: "soul-musician",
    description: "Générez 10 compositions musicales personnalisées",
    progress: 20,
    completed: false,
    status: "in-progress",
    points: 40,
    difficulty: "medium",
    category: "musique",
    tags: ["musique", "création"],
    goal: "10",
    totalSteps: 10
  },
];

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Novice émotionnel",
    description: "Premier scan émotionnel complété",
    icon: "brain",
    rarity: "common",
    dateEarned: "2023-09-15",
    category: "débutant"
  },
  {
    id: "2",
    name: "Explorateur en herbe",
    description: "A exploré 5 fonctionnalités différentes",
    icon: "compass",
    rarity: "common",
    dateEarned: "2023-09-18",
    category: "exploration"
  },
  {
    id: "3",
    name: "Journaliste",
    description: "A maintenu un journal émotionnel pendant 7 jours",
    icon: "book",
    rarity: "rare",
    dateEarned: "2023-09-25",
    category: "journal"
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    userId: "user123",
    username: "EmotionMaster",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Emma",
    points: 1250,
    rank: 1,
    badges: 8,
    streak: 14
  },
  {
    id: "2",
    userId: "user456",
    username: "MindfulSoul",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=John",
    points: 980,
    rank: 2,
    badges: 6,
    streak: 7
  },
  {
    id: "3",
    userId: "user789",
    username: "SereneSpirit",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Sophia",
    points: 870,
    rank: 3,
    badges: 5,
    streak: 12
  },
  {
    id: "4",
    userId: "user101",
    username: "CalmExplorer",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Lucas",
    points: 720,
    rank: 4,
    badges: 4,
    streak: 5
  },
  {
    id: "5",
    userId: "user202",
    username: "HarmonySeeker",
    avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Olivia",
    points: 650,
    rank: 5,
    badges: 3,
    streak: 3
  }
];
