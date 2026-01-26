/**
 * useMusicAchievements - Hook pour gérer les achievements musicaux
 * Vérifie automatiquement les conditions et débloque les badges
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { 
  checkAndUnlockBadges, 
  getUserMusicBadges, 
  MUSIC_BADGES,
  type MusicBadge 
} from '@/services/music/badges-service';
import { getUserHistory, getTotalListeningTime } from '@/services/music/history-service';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseMusicAchievementsReturn {
  badges: MusicBadge[];
  unlockedCount: number;
  totalCount: number;
  isLoading: boolean;
  checkAchievements: () => Promise<MusicBadge[]>;
  getBadgesByCategory: (category: string) => MusicBadge[];
  getProgress: () => number;
  stats: {
    totalTracks: number;
    totalMinutes: number;
    streak: number;
    uniqueGenres: number;
  };
}

export function useMusicAchievements(): UseMusicAchievementsReturn {
  const { user } = useAuth();
  const [badges, setBadges] = useState<MusicBadge[]>(MUSIC_BADGES);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalMinutes: 0,
    streak: 0,
    uniqueGenres: 0,
  });

  // Load badges and calculate stats on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Load user badges
        const userBadges = await getUserMusicBadges(user.id);
        setBadges(userBadges);

        // Load history for stats
        const history = await getUserHistory(500);
        const totalTime = await getTotalListeningTime();

        // Calculate stats
        const uniqueGenres = new Set(
          history.map(h => h.emotion || h.mood).filter(Boolean)
        ).size;

        // Calculate streak (simplified)
        const streak = calculateStreak(history);

        setStats({
          totalTracks: history.length,
          totalMinutes: Math.round(totalTime / 60),
          streak,
          uniqueGenres,
        });

        logger.info('Loaded music achievements', { 
          badges: userBadges.filter(b => b.unlocked).length,
          total: userBadges.length 
        }, 'MUSIC');
      } catch (error) {
        logger.error('Failed to load music achievements', error as Error, 'MUSIC');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Check and unlock achievements
  const checkAchievements = useCallback(async (): Promise<MusicBadge[]> => {
    if (!user) return [];

    try {
      const history = await getUserHistory(500);
      const newlyUnlocked = await checkAndUnlockBadges(user.id, history);

      if (newlyUnlocked.length > 0) {
        // Save to database
        for (const badge of newlyUnlocked) {
          try {
            await supabase.from('user_music_badges').upsert({
              user_id: user.id,
              badge_id: badge.id,
              is_unlocked: true,
              progress: badge.threshold || 1,
              earned_at: badge.unlockedAt,
            }, { onConflict: 'user_id,badge_id' });
          } catch {
            // Table might not exist, continue
          }
        }

        // Update local state
        setBadges(prev => prev.map(badge => {
          const unlocked = newlyUnlocked.find(u => u.id === badge.id);
          return unlocked || badge;
        }));

        // Show toast for each unlocked badge
        newlyUnlocked.forEach(badge => {
          toast.success(`${badge.icon} Badge débloqué !`, {
            description: `${badge.name}: ${badge.description}`,
            duration: 5000,
          });
        });

        logger.info('Unlocked new badges', { count: newlyUnlocked.length }, 'MUSIC');
      }

      return newlyUnlocked;
    } catch (error) {
      logger.error('Failed to check achievements', error as Error, 'MUSIC');
      return [];
    }
  }, [user]);

  // Get badges by category
  const getBadgesByCategory = useCallback((category: string): MusicBadge[] => {
    return badges.filter(badge => badge.category === category);
  }, [badges]);

  // Get overall progress percentage
  const getProgress = useCallback((): number => {
    const unlocked = badges.filter(b => b.unlocked).length;
    return Math.round((unlocked / badges.length) * 100);
  }, [badges]);

  return {
    badges,
    unlockedCount: badges.filter(b => b.unlocked).length,
    totalCount: badges.length,
    isLoading,
    checkAchievements,
    getBadgesByCategory,
    getProgress,
    stats,
  };
}

// Helper to calculate streak
function calculateStreak(history: any[]): number {
  if (history.length === 0) return 0;

  const dates = history
    .map(h => new Date(h.played_at).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    if (dates.includes(checkDate.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export default useMusicAchievements;
