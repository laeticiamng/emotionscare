/**
 * useParkAchievements - Hook pour générer tous les achievements du parc
 * Combine les zones débloquées avec les potentiels non débloqués
 */

import { useMemo } from 'react';
import { useAttractionProgress } from '@/hooks/useAttractionProgress';
import { parkZones } from '@/data/parkZones';
import { parkAttractions } from '@/data/parkAttractions';
import type { ZoneKey } from '@/types/park';

export interface ParkAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'mastery' | 'social' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward?: { xp: number; coins?: number };
}

// Définition des achievements possibles
const ZONE_ACHIEVEMENTS: Record<ZoneKey, { rarity: ParkAchievement['rarity']; xp: number; coins: number }> = {
  hub: { rarity: 'common', xp: 50, coins: 25 },
  calm: { rarity: 'common', xp: 75, coins: 35 },
  creative: { rarity: 'rare', xp: 100, coins: 50 },
  wisdom: { rarity: 'rare', xp: 100, coins: 50 },
  explore: { rarity: 'epic', xp: 150, coins: 75 },
  energy: { rarity: 'epic', xp: 150, coins: 75 },
  challenge: { rarity: 'legendary', xp: 200, coins: 100 },
  social: { rarity: 'legendary', xp: 200, coins: 100 }
};

const SPECIAL_ACHIEVEMENTS: ParkAchievement[] = [
  {
    id: 'first-visit',
    title: 'Premier Pas',
    description: 'Visitez votre première attraction du parc',
    icon: '👣',
    category: 'exploration',
    rarity: 'common',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    reward: { xp: 25, coins: 10 }
  },
  {
    id: 'explorer-10',
    title: 'Explorateur Curieux',
    description: 'Visitez 10 attractions différentes',
    icon: '🧭',
    category: 'exploration',
    rarity: 'rare',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    reward: { xp: 100, coins: 50 }
  },
  {
    id: 'explorer-25',
    title: 'Grand Voyageur',
    description: 'Visitez 25 attractions différentes',
    icon: '🌍',
    category: 'exploration',
    rarity: 'epic',
    progress: 0,
    maxProgress: 25,
    unlocked: false,
    reward: { xp: 250, coins: 125 }
  },
  {
    id: 'master-all',
    title: 'Maître du Parc',
    description: 'Complétez toutes les zones du parc',
    icon: '👑',
    category: 'mastery',
    rarity: 'legendary',
    progress: 0,
    maxProgress: 8,
    unlocked: false,
    reward: { xp: 500, coins: 250 }
  },
  {
    id: 'streak-7',
    title: 'Semaine Parfaite',
    description: 'Maintenez une série de 7 jours consécutifs',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    reward: { xp: 100, coins: 50 }
  },
  {
    id: 'streak-30',
    title: 'Mois Légendaire',
    description: 'Maintenez une série de 30 jours consécutifs',
    icon: '💎',
    category: 'streak',
    rarity: 'legendary',
    progress: 0,
    maxProgress: 30,
    unlocked: false,
    reward: { xp: 300, coins: 150 }
  }
];

export function useParkAchievements() {
  const { visitedAttractions, unlockedBadges, getZoneProgress } = useAttractionProgress();
  
  const visitedCount = Object.keys(visitedAttractions).length;
  const unlockedZonesCount = unlockedBadges.length;

  // Générer les achievements de zone
  const zoneAchievements = useMemo((): ParkAchievement[] => {
    return Object.entries(parkZones).map(([key, zone]) => {
      const zoneKey = key as ZoneKey;
      const config = ZONE_ACHIEVEMENTS[zoneKey];
      const zoneAttractions = parkAttractions.filter(a => a.zone === zoneKey);
      const progress = getZoneProgress(zoneAttractions.map(a => a.id));
      const badge = unlockedBadges.find(b => b.zoneKey === zoneKey);
      const isUnlocked = !!badge;

      return {
        id: `zone-${zoneKey}`,
        title: zone.name,
        description: `Complétez toutes les attractions de la zone ${zone.name}`,
        icon: zone.emoji,
        category: 'exploration' as const,
        rarity: config.rarity,
        progress: progress.visited,
        maxProgress: progress.total,
        unlocked: isUnlocked,
        unlockedAt: badge?.unlockedAt ? (
          typeof badge.unlockedAt === 'number' 
            ? new Date(badge.unlockedAt).toISOString() 
            : badge.unlockedAt
        ) : undefined,
        reward: { xp: config.xp, coins: config.coins }
      };
    });
  }, [unlockedBadges, getZoneProgress]);

  // Mettre à jour les achievements spéciaux avec la progression réelle
  const specialAchievements = useMemo((): ParkAchievement[] => {
    return SPECIAL_ACHIEVEMENTS.map(achievement => {
      let progress = 0;
      let unlocked = false;

      switch (achievement.id) {
        case 'first-visit':
          progress = Math.min(1, visitedCount);
          unlocked = visitedCount >= 1;
          break;
        case 'explorer-10':
          progress = Math.min(10, visitedCount);
          unlocked = visitedCount >= 10;
          break;
        case 'explorer-25':
          progress = Math.min(25, visitedCount);
          unlocked = visitedCount >= 25;
          break;
        case 'master-all':
          progress = unlockedZonesCount;
          unlocked = unlockedZonesCount >= 8;
          break;
        // Les streaks seront mis à jour via le hook useParkStreak
        default:
          progress = achievement.progress;
          unlocked = achievement.unlocked;
      }

      return {
        ...achievement,
        progress,
        unlocked,
        unlockedAt: unlocked ? new Date().toISOString() : undefined
      };
    });
  }, [visitedCount, unlockedZonesCount]);

  // Combiner tous les achievements
  const allAchievements = useMemo(() => {
    return [...zoneAchievements, ...specialAchievements].sort((a, b) => {
      // Triés par: débloqués d'abord, puis par rareté
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });
  }, [zoneAchievements, specialAchievements]);

  // Stats
  const stats = useMemo(() => {
    const unlocked = allAchievements.filter(a => a.unlocked);
    const totalXP = unlocked.reduce((sum, a) => sum + (a.reward?.xp || 0), 0);
    const totalCoins = unlocked.reduce((sum, a) => sum + (a.reward?.coins || 0), 0);
    
    return {
      totalAchievements: allAchievements.length,
      unlockedCount: unlocked.length,
      totalXP,
      totalCoins,
      completionPercentage: Math.round((unlocked.length / allAchievements.length) * 100)
    };
  }, [allAchievements]);

  return {
    achievements: allAchievements,
    zoneAchievements,
    specialAchievements,
    stats
  };
}

export default useParkAchievements;
