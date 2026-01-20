import { useState, useEffect } from 'react';
import { Badge, Challenge } from '@/types/badge';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GamificationStats {
  totalPoints: number;
  level: number;
  streakDays: number;
  nextLevelPoints: number;
  completedChallenges: number;
  totalChallenges: number;
  unlockedBadges: number;
  totalBadges: number;
  percentageToNextLevel: number;
}

export const useGamificationStats = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 0,
    level: 1,
    streakDays: 0,
    nextLevelPoints: 100,
    completedChallenges: 0,
    totalChallenges: 0,
    unlockedBadges: 0,
    totalBadges: 0,
    percentageToNextLevel: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!effectiveUserId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Récupérer les stats utilisateur depuis Supabase
        const [userStatsRes, badgesRes, challengesRes, userBadgesRes, userChallengesRes] = await Promise.all([
          supabase.from('user_stats').select('total_points, streak_days').eq('user_id', effectiveUserId).maybeSingle(),
          supabase.from('activity_badges').select('*').limit(50),
          supabase.from('weekly_challenges').select('*').eq('is_active', true),
          supabase.from('user_badges').select('badge_id').eq('user_id', effectiveUserId),
          supabase.from('user_challenges_progress').select('challenge_id, completed').eq('user_id', effectiveUserId)
        ]);

        const userStats = userStatsRes.data;
        const allBadges = badgesRes.data || [];
        const allChallenges = challengesRes.data || [];
        const userBadgeIds = new Set((userBadgesRes.data || []).map(b => b.badge_id));
        const userChallengesMap = new Map((userChallengesRes.data || []).map(c => [c.challenge_id, c.completed]));

        // Mapper les badges
        const mappedBadges: Badge[] = allBadges.map(b => ({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          category: b.category,
          unlocked: userBadgeIds.has(b.id),
          unlockedAt: userBadgeIds.has(b.id) ? new Date().toISOString() : undefined,
          rarity: (b.rarity as 'common' | 'rare' | 'epic' | 'legendary') || 'common'
        }));

        // Mapper les challenges
        const mappedChallenges: Challenge[] = allChallenges.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          type: 'weekly',
          points: c.xp_reward || 50,
          progress: userChallengesMap.get(c.id) ? 100 : 0,
          target: 100,
          status: userChallengesMap.get(c.id) ? 'completed' as const : 'active' as const,
          startDate: c.starts_at || new Date().toISOString(),
          endDate: c.ends_at || new Date().toISOString()
        }));

        setBadges(mappedBadges);
        setChallenges(mappedChallenges);
        
        const totalPoints = userStats?.total_points || 0;
        const level = Math.floor(totalPoints / 100) + 1;
        const nextLevelPoints = level * 100;
        const percentageToNextLevel = ((totalPoints % 100) / 100) * 100;
        const completedChallenges = mappedChallenges.filter(c => c.status === 'completed').length;
        const unlockedBadges = mappedBadges.filter(b => b.unlocked).length;
        
        setStats({
          totalPoints,
          level,
          streakDays: userStats?.streak_days || 0,
          nextLevelPoints,
          completedChallenges,
          totalChallenges: mappedChallenges.length,
          unlockedBadges,
          totalBadges: mappedBadges.length,
          percentageToNextLevel,
        });
        
      } catch (error) {
        logger.error('Error fetching gamification data', error as Error, 'UI');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [effectiveUserId]);

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, status: 'completed' as const } 
          : challenge
      )
    );
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => 
      prev.map(badge => 
        badge.id === badgeId 
          ? { ...badge, unlocked: true } 
          : badge
      )
    );
  };

  return {
    badges,
    challenges,
    stats,
    loading,
    completeChallenge,
    unlockBadge
  };
};

export default useGamificationStats;
