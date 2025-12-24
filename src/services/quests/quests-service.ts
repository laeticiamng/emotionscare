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
export async function generateDailyQuests(userId: string): Promise<Quest[]> {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  try {
    const { supabase } = await import('@/integrations/supabase/client');

    // Check if quests already exist for today
    const { data: existingQuests } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'daily')
      .gte('expires_at', today.toISOString());

    if (existingQuests && existingQuests.length > 0) {
      return existingQuests.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        type: q.type,
        category: q.category,
        difficulty: q.difficulty,
        targetValue: q.target_value,
        currentValue: q.current_value || 0,
        xpReward: q.xp_reward,
        badgeReward: q.badge_reward,
        completed: q.is_completed || false,
        expiresAt: q.expires_at,
        icon: q.icon
      }));
    }

    // Generate new quests if none exist
    const shuffled = [...DAILY_QUESTS_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));

    const quests = selected.map((template, index) => ({
      ...template,
      id: `daily_${userId}_${today.toISOString().split('T')[0]}_${index}`,
      currentValue: 0,
      completed: false,
      expiresAt: tomorrow.toISOString()
    }));

    // Save to Supabase
    await supabase.from('quests').insert(
      quests.map(q => ({
        id: q.id,
        user_id: userId,
        title: q.title,
        description: q.description,
        type: q.type,
        category: q.category,
        difficulty: q.difficulty,
        target_value: q.targetValue,
        current_value: q.currentValue,
        xp_reward: q.xpReward,
        badge_reward: q.badgeReward,
        is_completed: q.completed,
        expires_at: q.expiresAt,
        icon: q.icon,
        created_at: new Date().toISOString()
      }))
    );

    return quests;
  } catch (error) {
    // Fallback to local generation if Supabase fails
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
}

/**
 * Génère les quêtes de la semaine pour un utilisateur
 */
export async function generateWeeklyQuests(userId: string): Promise<Quest[]> {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  try {
    const { supabase } = await import('@/integrations/supabase/client');

    // Check if weekly quests already exist
    const { data: existingQuests } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'weekly')
      .gte('expires_at', today.toISOString());

    if (existingQuests && existingQuests.length > 0) {
      return existingQuests.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        type: q.type,
        category: q.category,
        difficulty: q.difficulty,
        targetValue: q.target_value,
        currentValue: q.current_value || 0,
        xpReward: q.xp_reward,
        badgeReward: q.badge_reward,
        completed: q.is_completed || false,
        expiresAt: q.expires_at,
        icon: q.icon
      }));
    }

    // Generate new quests
    const shuffled = [...WEEKLY_QUESTS_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));

    const quests = selected.map((template, index) => ({
      ...template,
      id: `weekly_${userId}_${today.toISOString().split('T')[0]}_${index}`,
      currentValue: 0,
      completed: false,
      expiresAt: nextWeek.toISOString()
    }));

    // Save to Supabase
    await supabase.from('quests').insert(
      quests.map(q => ({
        id: q.id,
        user_id: userId,
        title: q.title,
        description: q.description,
        type: q.type,
        category: q.category,
        difficulty: q.difficulty,
        target_value: q.targetValue,
        current_value: q.currentValue,
        xp_reward: q.xpReward,
        badge_reward: q.badgeReward,
        is_completed: q.completed,
        expires_at: q.expiresAt,
        icon: q.icon,
        created_at: new Date().toISOString()
      }))
    );

    return quests;
  } catch (error) {
    // Fallback to local generation
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
}

/**
 * Met à jour la progression d'une quête
 */
export async function updateQuestProgress(
  quests: Quest[],
  questId: string,
  incrementBy: number = 1
): Promise<Quest[]> {
  const updatedQuests = quests.map(quest => {
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

  // Persist to Supabase
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const updatedQuest = updatedQuests.find(q => q.id === questId);

    if (updatedQuest) {
      await supabase
        .from('quests')
        .update({
          current_value: updatedQuest.currentValue,
          is_completed: updatedQuest.completed,
          completed_at: updatedQuest.completed ? new Date().toISOString() : null
        })
        .eq('id', questId);
    }
  } catch (error) {
    // Continue with local state even if Supabase fails
  }

  return updatedQuests;
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
