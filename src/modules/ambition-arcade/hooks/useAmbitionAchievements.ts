// @ts-nocheck
/**
 * Hook pour les achievements Ambition Arcade
 */
import { useMemo } from 'react';
import { useAmbitionStats } from './useAmbitionStats';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'runs' | 'quests' | 'xp' | 'streak' | 'artifacts';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

const ACHIEVEMENT_DEFINITIONS = [
  // Runs
  { id: 'first_run', name: 'Premier Pas', description: 'Créer votre premier objectif', icon: '🎯', category: 'runs', rarity: 'common', condition: (s: any) => s.totalRuns >= 1, max: 1 },
  { id: 'five_runs', name: 'Ambitieux', description: 'Créer cinq objectifs', icon: '🚀', category: 'runs', rarity: 'rare', condition: (s: any) => s.totalRuns >= 5, max: 5 },
  { id: 'ten_runs', name: 'Visionnaire', description: 'Créer dix objectifs', icon: '🌟', category: 'runs', rarity: 'epic', condition: (s: any) => s.totalRuns >= 10, max: 10 },
  { id: 'complete_run', name: 'Mission Accomplie', description: 'Compléter un objectif', icon: '✅', category: 'runs', rarity: 'common', condition: (s: any) => s.completedRuns >= 1, max: 1 },
  { id: 'five_complete', name: 'Persévérant', description: 'Compléter cinq objectifs', icon: '🏆', category: 'runs', rarity: 'epic', condition: (s: any) => s.completedRuns >= 5, max: 5 },
  
  // Quests
  { id: 'first_quest', name: 'Quêteur', description: 'Compléter une quête', icon: '⚔️', category: 'quests', rarity: 'common', condition: (s: any) => s.completedQuests >= 1, max: 1 },
  { id: 'ten_quests', name: 'Aventurier', description: 'Compléter dix quêtes', icon: '🗡️', category: 'quests', rarity: 'rare', condition: (s: any) => s.completedQuests >= 10, max: 10 },
  { id: 'fifty_quests', name: 'Héros', description: 'Compléter cinquante quêtes', icon: '🛡️', category: 'quests', rarity: 'epic', condition: (s: any) => s.completedQuests >= 50, max: 50 },
  { id: 'hundred_quests', name: 'Légende', description: 'Compléter cent quêtes', icon: '👑', category: 'quests', rarity: 'legendary', condition: (s: any) => s.completedQuests >= 100, max: 100 },
  
  // XP
  { id: 'xp_100', name: 'Débutant', description: 'Gagner 100 XP', icon: '⭐', category: 'xp', rarity: 'common', condition: (s: any) => s.totalXP >= 100, max: 100 },
  { id: 'xp_500', name: 'Apprenti', description: 'Gagner 500 XP', icon: '💫', category: 'xp', rarity: 'rare', condition: (s: any) => s.totalXP >= 500, max: 500 },
  { id: 'xp_1000', name: 'Expert', description: 'Gagner 1000 XP', icon: '🌟', category: 'xp', rarity: 'epic', condition: (s: any) => s.totalXP >= 1000, max: 1000 },
  { id: 'xp_5000', name: 'Maître', description: 'Gagner 5000 XP', icon: '✨', category: 'xp', rarity: 'legendary', condition: (s: any) => s.totalXP >= 5000, max: 5000 },
  
  // Streak
  { id: 'streak_3', name: 'Régulier', description: 'Streak de 3 jours', icon: '🔥', category: 'streak', rarity: 'common', condition: (s: any) => s.currentStreak >= 3, max: 3 },
  { id: 'streak_7', name: 'Constant', description: 'Streak de 7 jours', icon: '🔥', category: 'streak', rarity: 'rare', condition: (s: any) => s.currentStreak >= 7, max: 7 },
  { id: 'streak_30', name: 'Infaillible', description: 'Streak de 30 jours', icon: '💎', category: 'streak', rarity: 'legendary', condition: (s: any) => s.currentStreak >= 30, max: 30 },
  
  // Level
  { id: 'level_5', name: 'Niveau 5', description: 'Atteindre le niveau 5', icon: '🎮', category: 'xp', rarity: 'rare', condition: (s: any) => s.level >= 5, max: 5 },
  { id: 'level_10', name: 'Niveau 10', description: 'Atteindre le niveau 10', icon: '🎯', category: 'xp', rarity: 'epic', condition: (s: any) => s.level >= 10, max: 10 },
  
  // Artifacts
  { id: 'first_artifact', name: 'Collectionneur', description: 'Obtenir votre premier artefact', icon: '💎', category: 'artifacts', rarity: 'common', condition: (s: any) => s.artifacts >= 1, max: 1 },
  { id: 'five_artifacts', name: 'Trésorier', description: 'Obtenir 5 artefacts', icon: '🏺', category: 'artifacts', rarity: 'rare', condition: (s: any) => s.artifacts >= 5, max: 5 },
  { id: 'ten_artifacts', name: 'Archéologue', description: 'Obtenir 10 artefacts', icon: '🗿', category: 'artifacts', rarity: 'epic', condition: (s: any) => s.artifacts >= 10, max: 10 },
  { id: 'legendary_hunter', name: 'Chasseur de Légendes', description: 'Obtenir 25 artefacts', icon: '👑', category: 'artifacts', rarity: 'legendary', condition: (s: any) => s.artifacts >= 25, max: 25 },
] as const;

export function useAmbitionAchievements() {
  const { data: stats, isLoading } = useAmbitionStats();

  const achievements = useMemo((): Achievement[] => {
    if (!stats) return [];

    return ACHIEVEMENT_DEFINITIONS.map(def => {
      const unlocked = def.condition(stats);
      let progress = 0;

      // Calculer la progression selon la catégorie
      switch (def.category) {
        case 'runs':
          progress = def.id.includes('complete') ? stats.completedRuns : stats.totalRuns;
          break;
        case 'quests':
          progress = stats.completedQuests;
          break;
        case 'xp':
          progress = def.id.includes('level') ? stats.level : stats.totalXP;
          break;
        case 'streak':
          progress = stats.currentStreak;
          break;
        case 'artifacts':
          progress = stats.artifacts;
          break;
        default:
          progress = 0;
      }

      return {
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        category: def.category as Achievement['category'],
        rarity: def.rarity as Achievement['rarity'],
        unlocked,
        progress: Math.min(progress, def.max),
        maxProgress: def.max,
        unlockedAt: unlocked ? new Date().toISOString() : undefined
      };
    });
  }, [stats]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    unlockedCount,
    totalCount,
    isLoading,
    stats
  };
}
