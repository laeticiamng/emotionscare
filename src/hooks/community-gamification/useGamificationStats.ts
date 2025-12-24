// @ts-nocheck

// @ts-nocheck
import { useState, useEffect } from 'react';
import { Badge, Challenge } from '@/types/badge';
import { mockBadges, mockChallenges } from './mockData';
import { logger } from '@/lib/logger';

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
      try {
        setLoading(true);

        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();
        const activeUserId = userId || user?.id;

        if (!activeUserId) {
          // Use fallback mock data if no user
          setBadges([...mockBadges]);
          setChallenges([...mockChallenges]);
          setLoading(false);
          return;
        }

        // Fetch badges from Supabase
        const { data: badgesData } = await supabase
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', activeUserId);

        const fetchedBadges: Badge[] = (badgesData || []).map(b => ({
          id: b.achievement_id || b.id,
          name: b.achievements?.name || 'Badge',
          description: b.achievements?.description || '',
          image: b.achievements?.icon_url || '/images/badges/default.svg',
          imageUrl: b.achievements?.icon_url || '/images/badges/default.svg',
          rarity: b.achievements?.tier || 'common',
          unlocked: true,
          earned: true
        }));

        // Merge with mock badges for those not earned yet
        const allBadges = [...fetchedBadges];
        mockBadges.forEach(mockB => {
          if (!allBadges.find(b => b.id === mockB.id)) {
            allBadges.push({ ...mockB, unlocked: false, earned: false });
          }
        });
        setBadges(allBadges);

        // Fetch challenges from Supabase
        const { data: challengesData } = await supabase
          .from('challenges')
          .select('*')
          .or(`is_active.eq.true,user_id.eq.${activeUserId}`);

        const fetchedChallenges: Challenge[] = (challengesData || []).map(c => ({
          id: c.id,
          title: c.title || c.name,
          description: c.description || '',
          points: c.points || 0,
          reward: c.reward || '',
          progress: c.progress || 0,
          goal: c.target || 1,
          status: c.status || 'active',
          category: c.category || 'wellness',
          difficulty: c.difficulty || 'easy'
        }));

        // Use mock if no challenges in DB
        const allChallenges = fetchedChallenges.length > 0 ? fetchedChallenges : [...mockChallenges];
        setChallenges(allChallenges);

        // Calculate stats
        const totalPoints = allChallenges.reduce((sum, challenge) => {
          return sum + (challenge.status === 'completed' ? challenge.points : 0);
        }, 0);

        // Calculate streak from activity sessions
        const { data: sessions } = await supabase
          .from('activity_sessions')
          .select('created_at')
          .eq('user_id', activeUserId)
          .order('created_at', { ascending: false })
          .limit(365);

        let streakDays = 0;
        if (sessions && sessions.length > 0) {
          const uniqueDays = new Set(sessions.map(s => s.created_at.split('T')[0]));
          let checkDate = new Date();
          while (uniqueDays.has(checkDate.toISOString().split('T')[0])) {
            streakDays++;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }

        const level = Math.floor(totalPoints / 100) + 1;
        const nextLevelPoints = level * 100;
        const percentageToNextLevel = ((totalPoints % 100) / 100) * 100;

        const completedChallenges = allChallenges.filter(c => c.status === 'completed').length;
        const unlockedBadges = allBadges.filter(b => b.unlocked).length;

        setStats({
          totalPoints,
          level,
          streakDays,
          nextLevelPoints,
          completedChallenges,
          totalChallenges: allChallenges.length,
          unlockedBadges,
          totalBadges: allBadges.length,
          percentageToNextLevel,
        });

      } catch (error) {
        logger.error('Error fetching gamification data', error as Error, 'UI');
        // Fallback to mock data on error
        setBadges([...mockBadges]);
        setChallenges([...mockChallenges]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Function to complete a challenge
  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, status: 'completed' as const } 
          : challenge
      )
    );
  };

  // Function to unlock a badge
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
