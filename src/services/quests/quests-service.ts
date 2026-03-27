// @ts-nocheck
/**
 * Service de gestion des quêtes/missions quotidiennes et hebdomadaires
 * Progression temps réel avec récompenses XP et badges exclusifs
 */

export type QuestType = 'daily' | 'weekly' | 'special';
export type QuestCategory = 'music' | 'scan' | 'social' | 'coach' | 'meditation' | 'general';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  targetValue: number;
  currentValue: number;
  xpReward: number;
  badgeReward?: string;
  completed: boolean;
  expiresAt?: string;
  icon: string;
}

export interface QuestProgress {
  questId: string;
  progress: number;
  completedAt?: string;
}

// Quêtes quotidiennes par défaut
const DAILY_QUESTS_TEMPLATES: Omit<Quest, 'id' | 'currentValue' | 'completed' | 'expiresAt'>[] = [
  {
    title: 'Mélomane du jour',
    description: 'Écouter 3 playlists différentes',
    type: 'daily',
    category: 'music',
    difficulty: 'easy',
    targetValue: 3,
    xpReward: 50,
    icon: '🎵'
  },
  {
    title: 'Scan émotionnel',
    description: 'Compléter un scan d\'émotions',
    type: 'daily',
    category: 'scan',
    difficulty: 'easy',
    targetValue: 1,
    xpReward: 30,
    icon: '📸'
  },
  {
    title: 'Explorateur de genres',
    description: 'Découvrir 3 nouveaux genres musicaux',
    type: 'daily',
    category: 'music',
    difficulty: 'medium',
    targetValue: 3,
    xpReward: 75,
    icon: '🎼'
  },
  {
    title: 'Marathonien musical',
    description: 'Atteindre 30 minutes d\'écoute',
    type: 'daily',
    category: 'music',
    difficulty: 'medium',
    targetValue: 30,
    xpReward: 100,
    icon: '⏱️'
  },
  {
    title: 'Ambassadeur EmotionsCare',
    description: 'Inviter un ami à rejoindre la plateforme',
    type: 'daily',
    category: 'social',
    difficulty: 'hard',
    targetValue: 1,
    xpReward: 200,
    badgeReward: 'social_butterfly',
    icon: '👥'
  }
];

// Quêtes hebdomadaires par défaut
const WEEKLY_QUESTS_TEMPLATES: Omit<Quest, 'id' | 'currentValue' | 'completed' | 'expiresAt'>[] = [
  {
    title: 'Maestro de la semaine',
    description: 'Écouter 50 playlists différentes',
    type: 'weekly',
    category: 'music',
    difficulty: 'hard',
    targetValue: 50,
    xpReward: 500,
    badgeReward: 'weekly_maestro',
    icon: '🎭'
  },
  {
    title: 'Expert émotionnel',
    description: 'Compléter 7 scans d\'émotions',
    type: 'weekly',
    category: 'scan',
    difficulty: 'medium',
    targetValue: 7,
    xpReward: 300,
    icon: '🧠'
  },
  {
    title: 'Diversité musicale',
    description: 'Explorer 10 genres musicaux différents',
    type: 'weekly',
    category: 'music',
    difficulty: 'hard',
    targetValue: 10,
    xpReward: 400,
    badgeReward: 'music_explorer',
    icon: '🌈'
  },
  {
    title: 'Série hebdomadaire',
    description: 'Se connecter 7 jours d\'affilée',
    type: 'weekly',
    category: 'general',
    difficulty: 'medium',
    targetValue: 7,
    xpReward: 350,
    badgeReward: 'weekly_streak',
    icon: '🔥'
  }
];

/**
 * Génère les quêtes du jour pour un utilisateur
 */
export function generateDailyQuests(userId: string): Quest[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Sélectionner aléatoirement 3-4 quêtes quotidiennes
  const shuffled = [...DAILY_QUESTS_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));

  return selected.map((template, index) => ({
    ...template,
    id: `daily_${userId}_${today.toISOString().split('T')[0]}_${index}`,
    currentValue: 0,
    completed: false,
    expiresAt: tomorrow.toISOString()
  }));
}

/**
 * Génère les quêtes de la semaine pour un utilisateur
 */
export function generateWeeklyQuests(userId: string): Quest[] {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  // Sélectionner 2-3 quêtes hebdomadaires
  const shuffled = [...WEEKLY_QUESTS_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));

  return selected.map((template, index) => ({
    ...template,
    id: `weekly_${userId}_${today.toISOString().split('T')[0]}_${index}`,
    currentValue: 0,
    completed: false,
    expiresAt: nextWeek.toISOString()
  }));
}

/**
 * Met à jour la progression d'une quête
 */
export function updateQuestProgress(
  quests: Quest[],
  questId: string,
  incrementBy: number = 1
): Quest[] {
  return quests.map(quest => {
    if (quest.id === questId && !quest.completed) {
      const newValue = Math.min(quest.currentValue + incrementBy, quest.targetValue);
      const isCompleted = newValue >= quest.targetValue;
      
      return {
        ...quest,
        currentValue: newValue,
        completed: isCompleted
      };
    }
    return quest;
  });
}

/**
 * Vérifie si une quête est expirée
 */
export function isQuestExpired(quest: Quest): boolean {
  if (!quest.expiresAt) return false;
  return new Date(quest.expiresAt) < new Date();
}

/**
 * Calcule la progression en pourcentage
 */
export function getQuestProgressPercentage(quest: Quest): number {
  return Math.round((quest.currentValue / quest.targetValue) * 100);
}

/**
 * Obtient la couleur selon la difficulté
 */
export function getQuestDifficultyColor(difficulty: QuestDifficulty): string {
  const colors = {
    easy: 'text-green-500',
    medium: 'text-yellow-500',
    hard: 'text-red-500'
  };
  return colors[difficulty];
}

/**
 * Obtient le temps restant formaté
 */
export function getTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expiré';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}j restant${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}
